const RoleApplication = require("../models/role.model");
const MentorApplication = require("../models/mentor.model");
const User = require("../models/user.model");
const { updateExcelApplicationStatus, appendRoleApplication } = require("../utils/excel.utils");
const { sendAdminRoleNotificationEmail, sendUserRoleStatusEmail } = require("../utils/email.utils");
const fs = require("fs");
const path = require("path");

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

  // Prevent multiple active applications for the same role
  try {
    const existing = await RoleApplication.findOne({
      userId: req.user._id,
      roleId,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have an active or approved application for the ${roleId} role.`,
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
    const application = new RoleApplication({
      userId: req.user._id,
      roleId,
      ...req.body,
      status: "pending",
    });
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
    sendAdminRoleNotificationEmail(req.body.name, req.user.email, roleId);

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
      await user.save();

      // Trigger status alert email to the approved user
      sendUserRoleStatusEmail(userEmail, user.name, roleId, "Approved");
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
      sendUserRoleStatusEmail(userEmail, applicantUser.name, roleId, "Rejected");
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
const downloadExcelFile = (req, res) => {
  const { fileType } = req.query; // 'roles' or 'mentors'
  const fileName = fileType === "mentors" ? "mentor_applications.xlsx" : "role_applications.xlsx";
  const filePath = path.join(__dirname, "..", "..", "data", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: `Excel sheet for ${fileType || "role"} applications was not found or has not been generated yet.`,
    });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Excel download error:", err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error downloading file" });
      }
    }
  });
};

module.exports = {
  applyRole,
  getMyApplications,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  downloadExcelFile,
};
