const MentorApplication = require("../models/mentor.model");
const { appendMentorApplication } = require("../utils/excel.utils");
const { sendAdminRoleNotificationEmail } = require("../utils/email.utils");

/**
 * Handle mentor application submissions
 * POST /api/mentors/apply
 */
const applyMentor = async (req, res) => {
  const { name, email, github, repository, techStack, motivation } = req.body;

  // Basic validation
  if (!name || !email || !github || !repository || !techStack || !motivation) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  // Force application email to match registered user email for security/integrity
  if (String(email).toLowerCase() !== String(req.user.email).toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Application email must match your registered account email.",
    });
  }

  try {
    // Check if they already have an active application
    const existing = await MentorApplication.findOne({
      userId: req.user._id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have an active or approved application for the mentor role.",
      });
    }

    // 1. Save to Database (status is pending, role not changed yet)
    const application = new MentorApplication({
      userId: req.user._id,
      name,
      email: req.user.email, // lock email
      github,
      repository,
      techStack,
      motivation,
      status: "pending",
    });
    await application.save();

    // 2. Save to Excel Spreadsheet (Status is Pending)
    const excelSaved = appendMentorApplication({
      name,
      email: req.user.email, // lock email
      github,
      repository,
      techStack,
      motivation,
    });

    if (!excelSaved) {
      console.warn("[Mentor Controller] Excel logging failed, but database record was saved.");
    }

    // Trigger email alert to admin
    sendAdminRoleNotificationEmail(name, req.user.email, "mentor");

    res.status(201).json({
      success: true,
      message: "Mentor application submitted successfully! It is currently pending review.",
      application,
    });
  } catch (error) {
    console.error("Mentor Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while submitting your application",
    });
  }
};

module.exports = {
  applyMentor,
};
