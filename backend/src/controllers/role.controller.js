const RoleApplication = require("../models/role.model");
const MentorApplication = require("../models/mentor.model");
const User = require("../models/user.model");
const { updateExcelApplicationStatus, appendRoleApplication } = require("../utils/excel.utils");
const { sendAdminRoleNotificationEmail, sendUserRoleStatusEmail } = require("../utils/email.utils");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");


// Helper to generate a unique 6-character alphanumeric referral code for Ambassadors
const generateReferralCode = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";
  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await User.findOne({ referralCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

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
    const { name, email, phone, github, referredBy } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email address, and Mobile Number are required fields",
      });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    if (github) {
      const githubInput = String(github).trim();
      const githubLower = githubInput.toLowerCase();
      if (githubLower.includes("/") || githubLower.includes(".")) {
        if (!githubLower.includes("github.com")) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid GitHub username or GitHub profile link.",
          });
        }
        const parts = githubInput.split("github.com");
        const path = parts[parts.length - 1].replace(/^\//, "").trim();
        if (!path) {
          return res.status(400).json({
            success: false,
            message: "Please enter your full GitHub profile link including your username.",
          });
        }
      }
    }

    // Force application email to match registered user email for security/integrity
    if (String(email).toLowerCase() !== String(req.user.email).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Application email must match your registered account email.",
      });
    }

    let cleanCode = "";
    if (referredBy) {
      cleanCode = String(referredBy).trim().toUpperCase();
      const ambassador = await User.findOne({ referralCode: cleanCode });
      if (!ambassador) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code. No Ambassador found with this token.",
        });
      }

      // Also update the applicant user referredBy field if they don't already have one
      const applicantUser = await User.findById(req.user._id);
      if (applicantUser && !applicantUser.referredBy) {
        applicantUser.referredBy = cleanCode;
        await applicantUser.save();
      }
    }

    // Ensure applicant User has githubUsername synced from github field if provided
    if (github) {
      let cleanGithub = String(github).trim().replace(/^@/, "");
      if (cleanGithub.toLowerCase().includes("github.com")) {
        const parts = cleanGithub.split(/github\.com\/?/i);
        cleanGithub = (parts[parts.length - 1] || "").replace(/^\//, "").split("/")[0].split("?")[0].trim();
      }
      if (cleanGithub) {
        const applicantUser = await User.findById(req.user._id);
        if (applicantUser && (!applicantUser.githubUsername || applicantUser.githubUsername.includes("http") || applicantUser.githubUsername.includes("@"))) {
          applicantUser.githubUsername = cleanGithub;
          await applicantUser.save();
        }
      }
    }

    // 1. Save application data to MongoDB (default status is "pending")
    const appData = {
      userId: req.user._id,
      roleId,
      ...req.body,
      referredBy: cleanCode,
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
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || "all";
    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";

    let roleApps = [];
    let mentorApps = [];

    // Filter query for MongoDB
    const roleQuery = {};
    const mentorQuery = {};

    if (filter === "pending" || filter === "approved" || filter === "rejected") {
      roleQuery.status = filter;
      mentorQuery.status = filter;
    } else if (filter !== "all") {
      roleQuery.roleId = filter;
      mentorQuery.roleId = filter; 
    }

    if (filter === "all" || filter === "pending" || filter === "approved" || filter === "rejected") {
      roleApps = await RoleApplication.find(roleQuery).populate("userId", "name email");
      mentorApps = await MentorApplication.find(mentorQuery).populate("userId", "name email");
    } else if (filter === "mentor") {
      mentorApps = await MentorApplication.find().populate("userId", "name email");
    } else {
      roleApps = await RoleApplication.find(roleQuery).populate("userId", "name email");
    }

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

    let filteredApps = allApps;
    if (search) {
      filteredApps = allApps.filter((app) => {
        return (
          app.name?.toLowerCase().includes(search) ||
          app.email?.toLowerCase().includes(search) ||
          app.roleId?.toLowerCase().includes(search) ||
          app.github?.toLowerCase().includes(search) ||
          app.college?.toLowerCase().includes(search) ||
          app.techStack?.toLowerCase().includes(search) ||
          app.projectName?.toLowerCase().includes(search) ||
          app.repoUrl?.toLowerCase().includes(search) ||
          app.linkedin?.toLowerCase().includes(search) ||
          (app.projects && Array.isArray(app.projects) && app.projects.some(proj => 
            proj.projectName?.toLowerCase().includes(search) || 
            proj.repoUrl?.toLowerCase().includes(search)
          ))
        );
      });
    }

    const paginatedApps = filteredApps.slice(skip, skip + limit);

    // Calculate tab counts
    const counts = {
      all: await RoleApplication.countDocuments() + await MentorApplication.countDocuments(),
      pending: await RoleApplication.countDocuments({ status: "pending" }) + await MentorApplication.countDocuments({ status: "pending" }),
      approved: await RoleApplication.countDocuments({ status: "approved" }) + await MentorApplication.countDocuments({ status: "approved" }),
      rejected: await RoleApplication.countDocuments({ status: "rejected" }) + await MentorApplication.countDocuments({ status: "rejected" }),
      contributor: await RoleApplication.countDocuments({ roleId: "contributor" }),
      ambassador: await RoleApplication.countDocuments({ roleId: "ambassador" }),
      "project-admin": await RoleApplication.countDocuments({ roleId: "project-admin" }),
      sponsor: await RoleApplication.countDocuments({ roleId: "sponsor" }),
      mentor: await MentorApplication.countDocuments()
    };

    res.status(200).json({
      success: true,
      applications: paginatedApps,
      hasMore: skip + paginatedApps.length < filteredApps.length,
      totalCount: filteredApps.length,
      counts
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
      const isNewRole = !user.roles?.includes(roleId) && user.role !== roleId;

      user.role = roleId;
      if (!user.roles) {
        user.roles = ["user"];
      }
      if (!user.roles.includes(roleId)) {
        user.roles.push(roleId);
      }
      if (roleId === "ambassador" && !user.referralCode) {
        user.referralCode = await generateReferralCode();
      }
      await user.save();

      // If they were referred by an ambassador, award base referral points on first approval if not already awarded
      const referralToken = application.referredBy || user.referredBy;
      if (referralToken) {
        try {
          const ambassador = await User.findOne({ referralCode: referralToken });
          if (ambassador && ambassador._id.toString() !== user._id.toString()) {
            // Update referrals count dynamically to be accurate
            ambassador.referralsCount = await User.countDocuments({ referredBy: referralToken });

            if (!ambassador.pointsHistory) {
              ambassador.pointsHistory = [];
            }
            
            const signupReason = `20 points for referral signup of ${user.name}`;
            const legacySignupReason = `50 points for referral signup of ${user.name}`;
            const hasBasePoints = ambassador.pointsHistory.some(hist => 
              hist.reason.includes(signupReason) || hist.reason.includes(legacySignupReason)
            );
            
            if (!hasBasePoints) {
              ambassador.points = (ambassador.points || 0) + 20;
              ambassador.pointsHistory.push({
                points: 20,
                reason: signupReason,
                createdAt: new Date()
              });
              await ambassador.save();
              console.log(`[Referral Applied] Awarded base 20 points to Ambassador ${ambassador.name} for referral of ${user.name}`);
            } else {
              await ambassador.save();
            }
          }
        } catch (err) {
          console.error("[Referral Error] Failed to update referrals/points during role approval:", err.message);
        }
      }

      // Trigger status alert email to the approved user
      try {
        await sendUserRoleStatusEmail(userEmail, user.name, roleId, "Approved", user.referralCode || "");
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
            Phone: app.phone || "",
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

/**
 * Fetch all users who have approved Ambassador or Contributor roles (Admin only)
 * GET /api/roles/admin/approved-users
 */
const getApprovedUsers = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";

    const query = {
      $or: [
        { role: { $in: ["ambassador", "contributor"] } },
        { roles: { $in: ["ambassador", "contributor"] } }
      ]
    };

    let users = await User.find(
      query,
      "name email role roles points referralsCount referralCode"
    ).sort({ name: 1 });

    if (search) {
      users = users.filter(usr => {
        return (
          usr.name?.toLowerCase().includes(search) ||
          usr.email?.toLowerCase().includes(search) ||
          usr.referralCode?.toLowerCase().includes(search) ||
          (usr.roles && usr.roles.some(r => r.toLowerCase().includes(search))) ||
          usr.role?.toLowerCase().includes(search)
        );
      });
    }

    const paginatedUsers = users.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      users: paginatedUsers,
      hasMore: skip + paginatedUsers.length < users.length
    });
  } catch (error) {
    console.error("Admin fetch approved users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load approved users"
    });
  }
};

/**
 * Award manual points to a user (Admin only)
 * POST /api/roles/admin/award-points
 */
const awardPoints = async (req, res) => {
  const { userId, points, reason } = req.body;

  if (!userId || points === undefined) {
    return res.status(400).json({
      success: false,
      message: "User ID and points value are required",
    });
  }

  const pointsToAdd = parseInt(points);
  if (isNaN(pointsToAdd)) {
    return res.status(400).json({
      success: false,
      message: "Points must be a valid number",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Award points
    user.points = (user.points || 0) + pointsToAdd;
    if (!user.pointsHistory) {
      user.pointsHistory = [];
    }
    user.pointsHistory.push({
      points: pointsToAdd,
      reason: reason || "Manual award by Admin",
    });
    await user.save();

    console.log(`[Manual Points] Admin ${req.user.email} awarded ${pointsToAdd} points to ${user.name} (Reason: ${reason || "none"})`);

    res.status(200).json({
      success: true,
      message: `Successfully awarded ${pointsToAdd} points to ${user.name}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  } catch (error) {
    console.error("Admin award points error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while awarding points",
    });
  }
};

/**
 * Fetch detailed profile, rank, points, and applications for a user
 * GET /api/roles/admin/users/:userId/details
 */
const getUserDetailsForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId).lean();
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch all applications by this user
    const applications = await RoleApplication.find({ userId }).sort({ createdAt: -1 }).lean();

    // Calculate rankings
    // 1. Overall Rank
    const allUsersSorted = await User.find({ points: { $gt: 0 } }, "_id points referralsCount")
      .sort({ points: -1, referralsCount: -1 })
      .lean();
    const overallRankIndex = allUsersSorted.findIndex(u => String(u._id) === String(userId));
    const overallRank = overallRankIndex !== -1 ? overallRankIndex + 1 : "Unranked";

    // 2. Ambassador Rank
    let ambassadorRank = "N/A";
    if (targetUser.role === "ambassador" || (targetUser.roles && targetUser.roles.includes("ambassador"))) {
      const allAmbassadorsSorted = await User.find({
        $or: [{ role: "ambassador" }, { roles: "ambassador" }],
        points: { $gt: 0 }
      }, "_id points referralsCount")
        .sort({ points: -1, referralsCount: -1 })
        .lean();
      const ambRankIndex = allAmbassadorsSorted.findIndex(u => String(u._id) === String(userId));
      ambassadorRank = ambRankIndex !== -1 ? ambRankIndex + 1 : "Unranked";
    }

    // 3. Contributor Rank
    let contributorRank = "N/A";
    if (targetUser.role === "contributor" || (targetUser.roles && targetUser.roles.includes("contributor"))) {
      const allContributorsSorted = await User.find({
        $or: [{ role: "contributor" }, { roles: "contributor" }],
        points: { $gt: 0 }
      }, "_id points")
        .sort({ points: -1 })
        .lean();
      const contRankIndex = allContributorsSorted.findIndex(u => String(u._id) === String(userId));
      contributorRank = contRankIndex !== -1 ? contRankIndex + 1 : "Unranked";
    }

    let referralStats = null;
    let referredUsersList = [];

    if (targetUser.role === "ambassador" || (targetUser.roles && targetUser.roles.includes("ambassador"))) {
      const referredUsers = await User.find({ referredBy: targetUser.referralCode })
        .select("name email role roles isVerified createdAt")
        .lean();
      
      const verifiedUsers = referredUsers.filter(u => u.isVerified);
      const contributorCount = verifiedUsers.filter(u => u.roles.includes("contributor") || u.role === "contributor").length;
      const projectAdminCount = verifiedUsers.filter(u => u.roles.includes("project-admin") || u.role === "project-admin").length;
      const generalCount = verifiedUsers.length;

      referralStats = {
        verifiedSignups: generalCount,
        contributors: contributorCount,
        projectAdmins: projectAdminCount,
      };

      referredUsersList = referredUsers.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        roles: u.roles,
        isVerified: u.isVerified,
        createdAt: u.createdAt
      }));
    }

    let contributorStats = null;
    let contributorContributions = [];

    if (
      targetUser.role === "contributor" ||
      (targetUser.roles && targetUser.roles.includes("contributor")) ||
      (targetUser.solvedIssuesCount && targetUser.solvedIssuesCount > 0)
    ) {
      contributorContributions = (targetUser.pointsHistory || [])
        .filter((h) => {
          const r = (h.reason || "").toLowerCase();
          return (
            r.includes("merged pr") ||
            r.includes("pr #") ||
            r.includes("solved issue") ||
            r.includes("pull request") ||
            r.includes("issue")
          );
        })
        .map((h) => ({
          points: h.points,
          reason: h.reason,
          createdAt: h.createdAt,
        }));

      contributorStats = {
        solvedIssuesCount: targetUser.solvedIssuesCount || 0,
        githubUsername: targetUser.githubUsername || "",
        totalPullRequestsPoints: contributorContributions.reduce(
          (sum, c) => sum + (c.points || 0),
          0
        ),
      };
    }

    res.status(200).json({
      success: true,
      user: {
        ...targetUser,
        overallRank,
        ambassadorRank,
        contributorRank,
        referralStats,
        referredUsersList,
        contributorStats,
        contributorContributions
      },
      applications
    });
  } catch (error) {
    console.error("Get user details for admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching user details",
    });
  }
};

module.exports = {
  applyRole,
  getMyApplications,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  downloadExcelFile,
  getApprovedUsers,
  awardPoints,
  getUserDetailsForAdmin,
};
