const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const User = require("../models/user.model");
const RoleApplication = require("../models/role.model");
const crypto = require("crypto");
const { fetchRepoDetails, fetchRepoIssues } = require("../utils/github.utils");

/**
 * Get all projects from database
 * GET /api/projects
 */
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("projectAdmin", "name email githubUsername avatar")
      .lean();

    // Fetch issue count for each project to show on the main page
    const formattedProjects = await Promise.all(
      projects.map(async (project) => {
        const issueCount = await Issue.countDocuments({
          projectId: project._id,
          status: "Open",
        });

        return {
          id: project._id,
          title: project.title,
          tag: project.tag,
          color: project.color,
          points: project.points || 0,
          image: project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
          description: project.description,
          stars: project.stars,
          forks: project.forks,
          date: `${issueCount} Issues open`,
        };
      })
    );

    res.status(200).json({
      success: true,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load projects",
    });
  }
};

/**
 * Get single project details by ID with synced issues
 * GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id)
      .populate("projectAdmin", "name email githubUsername avatar")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get open issues from the database
    const issues = await Issue.find({ projectId: project._id }).lean();

    // Map database issues to match the frontend expected structure
    const formattedIssues = issues.map((issue) => ({
      id: issue._id,
      number: issue.number,
      title: issue.title,
      difficulty: issue.difficulty,
      points: issue.points,
      status: issue.status,
      date: issue.date || "Active",
      link: issue.link,
    }));

    // Mock contributors and PRs for UI rendering matching the static data template
    const defaultContributors = [
      {
        name: project.projectAdmin?.name || "Maintainer",
        username: project.projectAdmin?.githubUsername || "projectadmin",
        points: 500,
        prCount: 12,
        role: "Maintainer",
        avatarColor: "#8b5cf6",
      },
    ];

    const defaultPrs = [
      {
        id: "#1",
        title: "feat: initial project structure implementation",
        author: project.projectAdmin?.githubUsername || "projectadmin",
        date: "1 week ago",
        status: "Merged",
        points: 100,
      },
    ];

    // Combine database and mocked elements
    const fullProjectDetails = {
      id: project._id,
      title: project.title,
      tag: project.tag,
      color: project.color,
      points: project.points || 0,
      image: project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      description: project.description,
      stars: project.stars,
      forks: project.forks,
      detailedStats: {
        contributors: project.detailedStats?.contributors || defaultContributors.length,
        openIssues: formattedIssues.filter((i) => i.status === "Open").length,
        prsMerged: project.detailedStats?.prsMerged || defaultPrs.length,
        totalCommits: project.detailedStats?.totalCommits || 15,
        linesOfCode: project.detailedStats?.linesOfCode || "5.4K",
        techStack: project.detailedStats?.techStack || ["JavaScript"],
      },
      issues: formattedIssues,
      contributors: defaultContributors,
      prs: defaultPrs,
    };

    res.status(200).json({
      success: true,
      project: fullProjectDetails,
    });
  } catch (error) {
    console.error("Get project details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load project details",
    });
  }
};

/**
 * Parse Owner and Repo from GitHub URL
 */
const parseGithubUrl = (url) => {
  const cleanUrl = url.trim().replace(/\/$/, "");
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
};

/**
 * Add a new project (Admin only)
 * POST /api/projects
 */
const createProject = async (req, res) => {
  const { title, tag, color, points, image, description, githubUrl, projectAdmin, techStack } = req.body;

  if (!title || !tag || !githubUrl || !projectAdmin || !description) {
    return res.status(400).json({
      success: false,
      message: "All fields: Title, Tag, Github URL, Project Admin, and Description are required.",
    });
  }

  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    return res.status(400).json({
      success: false,
      message: "Invalid GitHub Repository URL. Use format: https://github.com/owner/repo",
    });
  }

  const { owner, repo } = parsed;

  try {
    // 1. Verify that the project admin user actually exists
    const adminUser = await User.findById(projectAdmin);
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned Project Admin user not found.",
      });
    }

    // 2. Fetch repo statistics (stars, forks) from GitHub
    let gitDetails = { stars: 0, forks: 0 };
    try {
      gitDetails = await fetchRepoDetails(owner, repo);
    } catch (gitErr) {
      console.warn("Failed to fetch initial repository details from GitHub:", gitErr.message);
    }

    // 3. Generate a secure, unique webhook secret
    const webhookSecret = crypto.randomBytes(24).toString("hex");

    // 4. Save Project to Database
    const project = new Project({
      title,
      tag,
      color: color || "violet",
      points: points || 100,
      image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      description,
      githubUrl,
      githubOwner: owner,
      githubRepo: repo,
      stars: gitDetails.stars,
      forks: gitDetails.forks,
      projectAdmin,
      webhookSecret,
      detailedStats: {
        techStack: Array.isArray(techStack) ? techStack : techStack ? techStack.split(",").map(t => t.trim()) : ["JavaScript"],
      },
    });

    await project.save();

    // 5. Initial Sync: Fetch and save repo issues to Database
    let syncedIssuesCount = 0;
    try {
      const gitIssues = await fetchRepoIssues(owner, repo);
      if (gitIssues && gitIssues.length > 0) {
        const issuesToInsert = gitIssues.map((issue) => ({
          ...issue,
          projectId: project._id,
        }));
        await Issue.insertMany(issuesToInsert);
        syncedIssuesCount = issuesToInsert.length;
      }
    } catch (issueErr) {
      console.warn("Failed to perform initial sync of GitHub issues:", issueErr.message);
    }

    // 6. Generate Payload URL for the Webhook setup
    const publicUrl = process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const payloadUrl = `${publicUrl.replace(/\/$/, "")}/api/webhooks/github`;

    res.status(201).json({
      success: true,
      message: "Project created and synchronized successfully!",
      project,
      webhookConfig: {
        payloadUrl,
        secret: webhookSecret,
        syncedIssuesCount,
      },
    });
  } catch (error) {
    console.error("Create project error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A project with this GitHub repository URL already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error occurred while adding the project.",
    });
  }
};

/**
 * Get all users with 'project-admin' role
 * GET /api/projects/admins
 */
const getProjectAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "project-admin" }, "name email githubUsername avatar").lean();
    
    // Enrich with their approved project admin application data
    const enrichedAdmins = await Promise.all(
      admins.map(async (admin) => {
        const app = await RoleApplication.findOne({
          userId: admin._id,
          roleId: "project-admin",
          status: "approved",
        }).lean();

        return {
          ...admin,
          application: app ? {
            projectName: app.projectName || "",
            repoUrl: app.repoUrl || "",
            projects: app.projects || [],
            techStack: app.techStack || "",
            description: app.motivation || app.message || "",
          } : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      admins: enrichedAdmins,
    });
  } catch (error) {
    console.error("Fetch project admins error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load project admins",
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  getProjectAdmins,
};
