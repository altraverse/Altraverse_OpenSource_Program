const RoleApplication = require("../models/role.model");
const MentorApplication = require("../models/mentor.model");
const User = require("../models/user.model");
const { updateExcelApplicationStatus, appendRoleApplication } = require("../utils/excel.utils");
const { sendAdminRoleNotificationEmail, sendUserRoleStatusEmail } = require("../utils/email.utils");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

/**
 * Handle user application submission for specific roles
 * POST /api/roles/apply
 */
const applyRole = async (req, res) => {
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({
      success: false,
      message: "Role selection is required",
    });
  }

  // Prevent multiple active applications for the same role (except project-admin which can submit multiple applications)
  try {
    const query = {
      userId: req.user._id,
      roleId,
    };
    if (roleId === "project-admin") {
      query.status = "pending";
    } else {
      query.status = { $in: ["pending", "approved"] };
    }

    const existing = await RoleApplication.findOne(query);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: roleId === "project-admin"
          ? "You already have a pending project submission. Please wait for it to be reviewed."
          : `You already have an active or approved application for the ${roleId} role.`,
      });
    }

    // Validate base fields required for any role application
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email address are required fields",
      });
    }

    // Force application email to match registered user email for security/integrity
    if (String(email).toLowerCase() !== String(req.user.email).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Application email must match your registered account email.",
      });
    }

    // 1. Save application data to MongoDB (default status is "pending")
    const appData = {
      userId: req.user._id,
      roleId,
      ...req.body,
      status: "pending",
    };

    // Prefill legacy fields with first project for backwards compatibility if projects array is provided
    if (roleId === "project-admin" && req.body.projects && Array.isArray(req.body.projects) && req.body.projects.length > 0) {
      appData.projectName = req.body.projects[0].projectName;
      appData.repoUrl = req.body.projects[0].repoUrl;
    }

    const application = new RoleApplication(appData);
    await application.save();

    // 2. Append row to sheet-segmented Excel file (Status will be Pending)
    const excelSaved = appendRoleApplication(roleId, {
      ...req.body,
      email: req.user.email, // lock email
    });

    if (!excelSaved) {
      console.warn(`[Role Controller] Excel logging failed for ${roleId} application.`);
    }

    // Trigger admin notification alert email
    try {
      await sendAdminRoleNotificationEmail(req.body.name, req.user.email, roleId);
    } catch (err) {
      console.error("[SMTP Error] Admin role notification dispatch failed:", err.message);
    }

    res.status(201).json({
      success: true,
      message: `Your application for the ${roleId} track was submitted successfully!`,
      application,
    });
  } catch (error) {
    console.error(`Role application error for ${roleId}:`, error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while submitting your application",
    });
  }
};

/**
 * Fetch all applications submitted by the logged-in user
 * GET /api/roles/my-applications
 */
const getMyApplications = async (req, res) => {
  try {
    const roleApps = await RoleApplication.find({ userId: req.user._id });
    const mentorApps = await MentorApplication.find({ userId: req.user._id });

    // Format mentor applications to have a similar format for frontend rendering
    const formattedMentorApps = mentorApps.map((app) => ({
      _id: app._id,
      userId: app.userId,
      roleId: "mentor",
      name: app.name,
      email: app.email,
      github: app.github,
      repository: app.repository,
      techStack: app.techStack,
      motivation: app.motivation,
      status: app.status,
      createdAt: app.createdAt,
    }));

    res.status(200).json({
      success: true,
      applications: [...roleApps, ...formattedMentorApps],
    });
  } catch (error) {
    console.error("Fetch my applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load your applications",
    });
  }
};

/**
 * Fetch all applications (Admin only)
 * GET /api/roles/admin/applications
 */
const getAdminApplications = async (req, res) => {
  try {
    const roleApps = await RoleApplication.find().populate("userId", "name email");
    const mentorApps = await MentorApplication.find().populate("userId", "name email");

    const formattedMentorApps = mentorApps.map((app) => ({
      _id: app._id,
      userId: app.userId,
      roleId: "mentor",
      name: app.name,
      email: app.email,
      github: app.github,
      repository: app.repository,
      techStack: app.techStack,
      motivation: app.motivation,
      status: app.status,
      createdAt: app.createdAt,
    }));

    const allApps = [...roleApps, ...formattedMentorApps].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      applications: allApps,
    });
  } catch (error) {
    console.error("Admin fetch applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin applications",
    });
  }
};

/**
 * Approve a role application
 * POST /api/roles/admin/approve
 */
const approveApplication = async (req, res) => {
  const { applicationId, roleId } = req.body;

  if (!applicationId || !roleId) {
    return res.status(400).json({
      success: false,
      message: "Application ID and Role ID are required",
    });
  }

  try {
    let application;
    let userId;
    let userEmail;

    if (roleId === "mentor") {
      application = await MentorApplication.findById(applicationId);
      if (application) {
        application.status = "approved";
        await application.save();
        userId = application.userId;
        userEmail = application.email;
      }
    } else {
      application = await RoleApplication.findById(applicationId);
      if (application) {
        application.status = "approved";
        await application.save();
        userId = application.userId;
        userEmail = application.email;
      }
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update the corresponding user's role
    const user = await User.findById(userId);
    if (user) {
      user.role = roleId;
      if (!user.roles) {
        user.roles = ["user"];
      }
      if (!user.roles.includes(roleId)) {
        user.roles.push(roleId);
      }
      await user.save();

      // Trigger status alert email to the approved user
      try {
        await sendUserRoleStatusEmail(userEmail, user.name, roleId, "Approved");
      } catch (err) {
        console.error("[SMTP Error] User role status dispatch failed:", err.message);
      }
    }

    // Update status in the Excel file
    updateExcelApplicationStatus(roleId, userEmail, "Approved");

    res.status(200).json({
      success: true,
      message: `Application approved successfully. User role upgraded to "${roleId}".`,
      application,
    });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during approval",
    });
  }
};

/**
 * Reject a role application
 * POST /api/roles/admin/reject
 */
const rejectApplication = async (req, res) => {
  const { applicationId, roleId } = req.body;

  if (!applicationId || !roleId) {
    return res.status(400).json({
      success: false,
      message: "Application ID and Role ID are required",
    });
  }

  try {
    let application;
    let userEmail;

    if (roleId === "mentor") {
      application = await MentorApplication.findById(applicationId);
      if (application) {
        application.status = "rejected";
        await application.save();
        userEmail = application.email;
      }
    } else {
      application = await RoleApplication.findById(applicationId);
      if (application) {
        application.status = "rejected";
        await application.save();
        userEmail = application.email;
      }
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Trigger status alert email to the rejected user
    const applicantUser = await User.findById(application.userId);
    if (applicantUser) {
      try {
        await sendUserRoleStatusEmail(userEmail, applicantUser.name, roleId, "Rejected");
      } catch (err) {
        console.error("[SMTP Error] User role status dispatch failed:", err.message);
      }
    }

    // Update status in the Excel file
    updateExcelApplicationStatus(roleId, userEmail, "Rejected");

    res.status(200).json({
      success: true,
      message: "Application rejected successfully.",
      application,
    });
  } catch (error) {
    console.error("Reject application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during rejection",
    });
  }
};

/**
 * Download applications Excel sheets (Admin only)
 * GET /api/roles/admin/download-excel
 */
const downloadExcelFile = async (req, res) => {
  const { fileType } = req.query; // 'roles' or 'mentors'

  try {
    const workbook = xlsx.utils.book_new();

    if (fileType === "mentors") {
      // Fetch all mentor applications from MongoDB
      const applications = await MentorApplication.find({}).sort({ createdAt: -1 });

      const dataList = applications.map((app) => ({
        Timestamp: app.createdAt ? new Date(app.createdAt).toLocaleString() : "",
        Role: "Mentor",
        Name: app.name,
        Email: app.email,
        Status: app.status || "Pending",
        GitHub: app.github,
        Repository: app.repository,
        "Tech Stack": app.techStack,
        Motivation: app.motivation,
      }));

      const worksheet = xlsx.utils.json_to_sheet(dataList);

      // Set column widths for readability
      const cols = [
        { wch: 22 }, // Timestamp
        { wch: 10 }, // Role
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 12 }, // Status
        { wch: 20 }, // GitHub
        { wch: 35 }, // Repository
        { wch: 30 }, // Tech Stack
        { wch: 50 }, // Motivation
      ];
      worksheet["!cols"] = cols;

      xlsx.utils.book_append_sheet(workbook, worksheet, "Mentors");
    } else {
      // Fetch all general role applications from MongoDB
      const applications = await RoleApplication.find({}).sort({ createdAt: -1 });

      const rolesMap = {
        "contributor": "Contributors",
        "ambassador": "Ambassadors",
        "project-admin": "Project Admins",
        "sponsor": "Sponsors",
      };

      const rolesMapLabel = {
        "contributor": "Contributor",
        "ambassador": "Ambassador",
        "project-admin": "Project Admin",
        "sponsor": "Sponsor",
      };

      // Group by roleId
      const grouped = {
        contributor: [],
        ambassador: [],
        "project-admin": [],
        sponsor: []
      };

      applications.forEach((app) => {
        if (grouped[app.roleId]) {
          grouped[app.roleId].push(app);
        }
      });

      // Generate a sheet for each role
      for (const roleId of ["contributor", "ambassador", "project-admin", "sponsor"]) {
        const list = grouped[roleId] || [];
        const sheetName = rolesMap[roleId] || "Applications";
        const roleLabel = rolesMapLabel[roleId] || "Participant";

        const dataList = list.map((app) => {
          const row = {
            Timestamp: app.createdAt ? new Date(app.createdAt).toLocaleString() : "",
            Role: roleLabel,
            Name: app.name,
            Email: app.email,
            Status: app.status || "Pending",
          };

          if (roleId === "contributor") {
            row["GitHub"] = app.github || "";
            row["Tech Stack"] = app.techStack || "";
          } else if (roleId === "ambassador") {
            row["GitHub"] = app.github || "";
            row["College"] = app.college || "";
            row["Year"] = app.year || "";
            row["Motivation"] = app.motivation || "";
          } else if (roleId === "project-admin") {
            row["GitHub"] = app.github || "";
            row["Project Name"] = app.projectName || "";
            row["Repository URL"] = app.repoUrl || "";
            row["Motivation"] = app.motivation || "";
          } else if (roleId === "sponsor") {
            row["Company"] = app.company || "";
            row["Sponsorship Tier"] = app.tier || "";
            row["Message / Suggestions"] = app.message || "";
          }
          return row;
        });

        const worksheet = xlsx.utils.json_to_sheet(dataList);

        // Apply auto column widths
        if (dataList.length > 0) {
          const keys = Object.keys(dataList[0]);
          const cols = keys.map((key) => {
            const lengths = dataList.map((row) => String(row[key] || "").length);
            const maxLen = Math.max(key.length, ...lengths, 10);
            return { wch: Math.min(maxLen + 3, 50) };
          });
          worksheet["!cols"] = cols;
        }

        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    }

    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
    const fileName = fileType === "mentors" ? "mentor_applications.xlsx" : "role_applications.xlsx";

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(excelBuffer);

  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(500).json({ success: false, message: "Error generating Excel sheet" });
  }
};

module.exports = {
  applyRole,
  getMyApplications,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  downloadExcelFile,
};
