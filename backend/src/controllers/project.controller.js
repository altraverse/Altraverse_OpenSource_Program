const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const User = require("../models/user.model");
const RoleApplication = require("../models/role.model");
const crypto = require("crypto");
const { fetchRepoDetails, fetchRepoIssues, fetchRepoContributors, fetchRepoPullRequests } = require("../utils/github.utils");
const { syncProjectPullRequests } = require("../utils/sync.utils");

const getProjectBanner = (title, image) => {
  if (image && !image.includes("photo-1618005182384-a83a8bd57fbe") && !image.includes("smart_city_analyzer.png")) {
    return image;
  }
  const lower = (title || "").toLowerCase();
  if (lower.includes("learnsphere")) return "/banners/learnsphere.png";
  if (lower.includes("money mentor") || lower.includes("ai money")) return "/banners/ai_money_mentor.png";
  if (lower.includes("mentroid")) return "/banners/mentroid.png";
  if (lower.includes("agritech")) return "/banners/agritech.png";
  if (lower.includes("ember")) return "/banners/ember_renting.png";
  if (lower.includes("smart city") || lower.includes("city analyzer")) return "/banners/smart_city_analyzer.png";
  return null;
};

/**
 * Get all projects from database
 * GET /api/projects
 */
const getAllProjects = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    const projects = await Project.find(filter)
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
          image: getProjectBanner(project.title, project.image),
          description: project.description,
          stars: project.stars !== undefined && project.stars !== null ? project.stars : 0,
          forks: project.forks !== undefined && project.forks !== null ? project.forks : 0,
          date: `${issueCount} Issues open`,
          openIssueCount: issueCount,
          isActive: project.isActive,
          githubOwner: project.githubOwner,
          githubRepo: project.githubRepo,
          githubUrl: project.githubUrl,
          projectAdmin: project.projectAdmin,
        };
      })
    );

    // Sort projects in descending order of open issues count (highest open issues listed first)
    formattedProjects.sort((a, b) => (b.openIssueCount || 0) - (a.openIssueCount || 0));

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

    // Attempt to sync latest stars and forks from GitHub
    if (project.githubOwner && project.githubRepo) {
      try {
        const freshDetails = await fetchRepoDetails(project.githubOwner, project.githubRepo);
        if (freshDetails) {
          project.stars = freshDetails.stars !== undefined ? freshDetails.stars : project.stars || 0;
          project.forks = freshDetails.forks !== undefined ? freshDetails.forks : project.forks || 0;
          // Update database in background
          Project.updateOne(
            { _id: project._id },
            { $set: { stars: project.stars, forks: project.forks } }
          ).exec().catch((err) => console.warn("Background update of repo stats failed:", err.message));
        }
      } catch (err) {
        console.warn("Could not sync live stats from GitHub:", err.message);
      }
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

    // Fetch live contributors from GitHub
    let gitContributors = [];
    if (project.githubOwner && project.githubRepo) {
      try {
        gitContributors = await fetchRepoContributors(project.githubOwner, project.githubRepo);
      } catch (err) {
        console.warn("Could not fetch GitHub contributors:", err.message);
      }
    }

    // Find registered users matching the contributor GitHub usernames
    const contributorLogins = gitContributors.map((c) => c.username).filter(Boolean);
    let registeredUsers = [];
    if (contributorLogins.length > 0) {
      registeredUsers = await User.find({
        githubUsername: { $in: contributorLogins.map((login) => new RegExp(`^${login}$`, "i")) },
      })
        .select("name email githubUsername avatar points solvedIssuesCount role")
        .lean();
    }

    const registeredUserMap = new Map();
    registeredUsers.forEach((u) => {
      if (u.githubUsername) {
        registeredUserMap.set(u.githubUsername.toLowerCase(), u);
      }
    });

    // Formatted contributors list
    const avatarColors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"];
    const contributorsList = gitContributors.map((c, index) => {
      const regUser = registeredUserMap.get(c.username.toLowerCase());
      return {
        name: regUser?.name || c.name || c.username,
        username: c.username,
        avatar: regUser?.avatar || c.avatar || `https://github.com/${c.username}.png`,
        avatar_url: c.avatar_url || `https://github.com/${c.username}.png`,
        points: regUser?.points || c.contributions * 25 || 50,
        prCount: c.contributions || regUser?.solvedIssuesCount || 1,
        role: regUser?.role === "project-admin" ? "Maintainer" : "Contributor",
        avatarColor: avatarColors[index % avatarColors.length],
        profileUrl: c.profileUrl || `https://github.com/${c.username}`,
      };
    });

    // Ensure project maintainer / admin is in the list
    if (project.projectAdmin) {
      const adminUsername = project.projectAdmin.githubUsername || "projectadmin";
      const existingIdx = contributorsList.findIndex(
        (c) => c.username?.toLowerCase() === adminUsername.toLowerCase()
      );
      if (existingIdx !== -1) {
        contributorsList[existingIdx].role = "Maintainer";
        contributorsList[existingIdx].name = project.projectAdmin.name || contributorsList[existingIdx].name;
        contributorsList[existingIdx].avatar =
          project.projectAdmin.avatar || contributorsList[existingIdx].avatar || `https://github.com/${adminUsername}.png`;
      } else {
        contributorsList.unshift({
          name: project.projectAdmin.name || "Maintainer",
          username: adminUsername,
          avatar: project.projectAdmin.avatar || `https://github.com/${adminUsername}.png`,
          avatar_url: project.projectAdmin.avatar || `https://github.com/${adminUsername}.png`,
          points: project.projectAdmin.points || 500,
          prCount: 12,
          role: "Maintainer",
          avatarColor: "#8b5cf6",
          profileUrl: `https://github.com/${adminUsername}`,
        });
      }
    }

    // Default fallback contributors if empty
    if (contributorsList.length === 0) {
      contributorsList.push({
        name: project.projectAdmin?.name || "Maintainer",
        username: project.projectAdmin?.githubUsername || "projectadmin",
        avatar: project.projectAdmin?.avatar || `https://github.com/${project.projectAdmin?.githubUsername || "projectadmin"}.png`,
        points: 500,
        prCount: 12,
        role: "Maintainer",
        avatarColor: "#8b5cf6",
        profileUrl: `https://github.com/${project.projectAdmin?.githubUsername || "projectadmin"}`,
      });
    }

    // Fetch live Pull Requests from GitHub and sync contributor points in background
    let prsList = [];
    if (project.githubOwner && project.githubRepo) {
      try {
        prsList = await fetchRepoPullRequests(project.githubOwner, project.githubRepo);
        // Synchronize merged PRs with database points asynchronously
        syncProjectPullRequests(project).catch((syncErr) =>
          console.warn("[Background Project PR Sync Error]:", syncErr.message)
        );
      } catch (err) {
        console.warn("Could not fetch GitHub pull requests:", err.message);
      }
    }

    if (prsList.length === 0) {
      prsList = [
        {
          id: "#1",
          number: 1,
          title: "feat: initial project repository structure",
          author: project.projectAdmin?.githubUsername || "projectadmin",
          authorAvatar: project.projectAdmin?.avatar || `https://github.com/${project.projectAdmin?.githubUsername || "projectadmin"}.png`,
          date: "1 week ago",
          status: "Merged",
          points: 100,
          link: project.githubUrl,
        },
      ];
    }

    // Combine database and live synced elements
    const fullProjectDetails = {
      id: project._id,
      title: project.title,
      tag: project.tag,
      color: project.color,
      points: project.points || 0,
      image: getProjectBanner(project.title, project.image),
      description: project.description,
      stars: project.stars !== undefined && project.stars !== null ? project.stars : 0,
      forks: project.forks !== undefined && project.forks !== null ? project.forks : 0,
      githubOwner: project.githubOwner,
      githubRepo: project.githubRepo,
      githubUrl: project.githubUrl,
      projectAdmin: project.projectAdmin,
      detailedStats: {
        contributors: contributorsList.length,
        openIssues: formattedIssues.filter((i) => i.status === "Open").length,
        prsMerged: prsList.filter((p) => p.status === "Merged").length || prsList.length,
        totalCommits: project.detailedStats?.totalCommits || 15,
        linesOfCode: project.detailedStats?.linesOfCode || "5.4K",
        techStack: project.detailedStats?.techStack || ["JavaScript"],
      },
      issues: formattedIssues,
      contributors: contributorsList,
      prs: prsList,
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
    // We need to check which projects are already live to add indicator flags
    const allLiveProjects = await Project.find({ isActive: { $ne: false } }, "githubUrl").lean();
    const liveUrls = new Set(allLiveProjects.map(p => (p.githubUrl || "").trim().toLowerCase()));

    const admins = await User.find({ 
      $or: [
        { role: "project-admin" },
        { roles: "project-admin" }
      ]
    }, "name email githubUsername avatar").lean();
    
    // Enrich with their approved project admin application data
    const enrichedAdmins = await Promise.all(
      admins.map(async (admin) => {
        const apps = await RoleApplication.find({
          userId: admin._id,
          roleId: "project-admin",
          status: "approved",
        }).lean();

        let allProjects = [];
        let techStack = "";
        let description = "";
        let liveCount = 0;

        apps.forEach(app => {
          if (app.projects && app.projects.length > 0) {
            app.projects.forEach(p => {
               const isLive = liveUrls.has((p.repoUrl || "").trim().toLowerCase());
               if (isLive) liveCount++;
               allProjects.push({ ...p, isLive });
            });
          } else if (app.projectName || app.repoUrl) {
            const isLive = liveUrls.has((app.repoUrl || "").trim().toLowerCase());
            if (isLive) liveCount++;
            allProjects.push({ projectName: app.projectName, repoUrl: app.repoUrl, isLive });
          }
          if (!techStack && app.techStack) techStack = app.techStack;
          if (!description && (app.motivation || app.message)) description = app.motivation || app.message;
        });

        let status = "none";
        if (allProjects.length > 0) {
           if (liveCount === allProjects.length) status = "all-live";
           else if (liveCount > 0) status = "partial-live";
        }

        return {
          ...admin,
          application: apps.length > 0 ? {
            projectName: allProjects[0]?.projectName || "",
            repoUrl: allProjects[0]?.repoUrl || "",
            projects: allProjects,
            techStack,
            description,
            liveStatus: status,
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

/**
 * Toggle project active status (Admin only)
 * PATCH /api/projects/:id/toggle-active
 */
const toggleProjectActive = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.isActive = !project.isActive;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project is now ${project.isActive ? 'active' : 'inactive'}`,
      isActive: project.isActive
    });
  } catch (error) {
    console.error("Toggle project error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update project details (Admin only)
 * PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, color, points, image, description } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (title) project.title = title;
    if (tag) project.tag = tag;
    if (color) project.color = color;
    if (points !== undefined) project.points = points;
    if (image !== undefined) project.image = image;
    if (description) project.description = description;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get project webhook configuration (Payload URL and Secret Token)
 * GET /api/projects/:id/webhook-config
 */
const getWebhookConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const publicUrl = process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const payloadUrl = `${publicUrl.replace(/\/$/, "")}/api/webhooks/github`;

    res.status(200).json({
      success: true,
      webhookConfig: {
        projectId: project._id,
        title: project.title,
        githubUrl: project.githubUrl,
        payloadUrl,
        secret: project.webhookSecret,
      },
    });
  } catch (error) {
    console.error("Get webhook config error:", error);
    res.status(500).json({ success: false, message: "Failed to load webhook configuration" });
  }
};

/**
 * Regenerate project webhook secret token
 * POST /api/projects/:id/regenerate-webhook-secret
 */
const regenerateWebhookSecret = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const newSecret = crypto.randomBytes(24).toString("hex");
    project.webhookSecret = newSecret;
    await project.save();

    const publicUrl = process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";
    const payloadUrl = `${publicUrl.replace(/\/$/, "")}/api/webhooks/github`;

    res.status(200).json({
      success: true,
      message: "Webhook secret regenerated successfully!",
      webhookConfig: {
        projectId: project._id,
        title: project.title,
        githubUrl: project.githubUrl,
        payloadUrl,
        secret: newSecret,
      },
    });
  } catch (error) {
    console.error("Regenerate webhook secret error:", error);
    res.status(500).json({ success: false, message: "Failed to regenerate webhook secret" });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  getProjectAdmins,
  toggleProjectActive,
  updateProject,
  getWebhookConfig,
  regenerateWebhookSecret,
};

