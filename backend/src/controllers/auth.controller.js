const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const { generateOTP, sendOTPEmail, sendResetPasswordOTPEmail } = require("../utils/email.utils");

const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.FRONTEND_URL}/community`);
};

const getMe = async (req, res) => {
  try {
    let userObj = req.user.toObject();

    if (req.user.role === "ambassador" || (req.user.roles && req.user.roles.includes("ambassador"))) {
      // Find all users referred by this ambassador
      const referredUsers = await User.find({ referredBy: req.user.referralCode })
        .select("name email role roles isVerified createdAt")
        .lean();
      
      const verifiedUsers = referredUsers.filter(u => u.isVerified);
      const contributorCount = verifiedUsers.filter(u => u.roles.includes("contributor") || u.role === "contributor").length;
      const projectAdminCount = verifiedUsers.filter(u => u.roles.includes("project-admin") || u.role === "project-admin").length;
      const generalCount = verifiedUsers.length;
      
      userObj.referralStats = {
        verifiedSignups: generalCount,
        contributors: contributorCount,
        projectAdmins: projectAdminCount,
      };

      userObj.referredUsersList = referredUsers.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        roles: u.roles,
        isVerified: u.isVerified,
        createdAt: u.createdAt
      }));
    }

    res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    console.error("getMe Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching user profile",
    });
  }
};

const joinCommunity = async (req, res) => {
  req.user.isCommunityJoined = true;
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Community joined successfully",
    user: req.user,
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ================= PHASE 1 CONTROLLERS =================

/**
 * Register a new contributor
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists.",
        });
      } else {
        // User exists but is not verified, regenerate OTP and update password
        user.name = name;
        user.password = password; // pre-save hook will hash it when saved
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password,
      });
    }

    // Generate and assign OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();
    
    // Send email with OTP (awaited for Serverless compatibility)
    try {
      await sendOTPEmail(email, name, otp);
    } catch (err) {
      console.error("[SMTP Error] Registration OTP dispatch failed:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email. Please verify.",
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during registration",
    });
  }
};

/**
 * Verify OTP code
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP code are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified && !user.otp) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    // Validate OTP and Expiration
    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = "";
    user.otpExpires = undefined;
    await user.save();

    // Create JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isCommunityJoined: user.isCommunityJoined,
        profileCompleted: user.profileCompleted,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

/**
 * Resend Verification OTP
 * POST /api/auth/resend-otp
 */
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified",
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email with OTP (awaited for Serverless compatibility)
    try {
      await sendOTPEmail(email, user.name, otp);
    } catch (err) {
      console.error("[SMTP Error] Resend OTP dispatch failed:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "New OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while resending OTP",
    });
  }
};

/**
 * Log in a contributor
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Explicitly select password field since it is marked as select: false in the model
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please register again or verify using OTP.",
        notVerified: true,
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isCommunityJoined: user.isCommunityJoined,
        profileCompleted: user.profileCompleted,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during login",
    });
  }
};

/**
 * Claim an Ambassador's referral code
 * POST /api/auth/apply-referral
 */
const applyReferral = async (req, res) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    return res.status(400).json({
      success: false,
      message: "Referral code is required",
    });
  }

  const cleanCode = String(referralCode).trim().toUpperCase();

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has already applied a referral code
    if (user.referredBy) {
      return res.status(400).json({
        success: false,
        message: `You have already applied a referral code: ${user.referredBy}`,
      });
    }

    // Find the Ambassador with this code
    const ambassador = await User.findOne({ referralCode: cleanCode });
    if (!ambassador) {
      return res.status(404).json({
        success: false,
        message: "Invalid referral code. No Ambassador found with this token.",
      });
    }

    // Check if the user is attempting to refer themselves
    if (ambassador._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own referral code.",
      });
    }

    // Apply referral
    user.referredBy = cleanCode;
    await user.save();

    // Credit points to the Ambassador
    let extraPoints = 20; // flat referral signup points

    ambassador.points = (ambassador.points || 0) + extraPoints;
    if (!ambassador.pointsHistory) {
      ambassador.pointsHistory = [];
    }
    ambassador.pointsHistory.push({
      points: extraPoints,
      reason: `${extraPoints} points for referral signup of ${user.name}`
    });
    
    // Dynamically calculate unique referrals count
    ambassador.referralsCount = await User.countDocuments({ referredBy: cleanCode });
    await ambassador.save();

    res.status(200).json({
      success: true,
      message: `Referral code successfully applied! ${extraPoints} points awarded to Ambassador ${ambassador.name}.`,
      referredBy: cleanCode,
    });
  } catch (error) {
    console.error("Apply referral error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during referral processing",
    });
  }
};

/**
 * Request password reset OTP
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email address is required",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate 6-digit numeric reset OTP
    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send reset OTP email
    const emailSent = await sendResetPasswordOTPEmail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      message: emailSent
        ? "Password reset code sent to your email address"
        : "Failed to send email. Code printed to console for development.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while requesting password reset",
    });
  }
};

/**
 * Reset password using OTP
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, reset code, and new password are required fields",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Validate OTP and expiration
    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset code",
      });
    }

    if (Date.now() > user.resetPasswordOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "Password reset code has expired. Please request a new one.",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now login with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during password reset",
    });
  }
};

/**
 * Update user profile details
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const logDebug = (msg) => {
    try {
      fs.appendFileSync(path.join(__dirname, "../../debug.txt"), `[${new Date().toISOString()}] ${msg}\n`);
    } catch (err) {}
  };

  logDebug("updateProfile API entered");
  try {
    const { name, college, githubUsername, skills, avatar } = req.body;
    logDebug(`Body: ${JSON.stringify({ name, college, githubUsername, skills })}`);

    logDebug(`req.user info: ${req.user ? `ID=${req.user._id}, Name=${req.user.name}` : "undefined"}`);

    const user = await User.findById(req.user._id);
    logDebug(`User.findById complete. Found: ${user ? "yes" : "no"}`);
    if (!user) {
      logDebug("User not found in DB");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (college !== undefined) user.college = college;
    if (githubUsername !== undefined) user.githubUsername = githubUsername;
    if (avatar !== undefined) user.avatar = avatar;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === "string") {
        user.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Mark profile as completed if name, college, and skills are present
    if (user.name && user.college && user.skills && user.skills.length > 0) {
      user.profileCompleted = true;
    }

    logDebug("Calling user.save()...");
    await user.save();
    logDebug("user.save() complete!");

    let userObj = user.toObject();

    // Fetch referral stats/list for ambassador if needed
    if (user.role === "ambassador" || (user.roles && user.roles.includes("ambassador"))) {
      const referredUsers = await User.find({ referredBy: user.referralCode })
        .select("name email role roles isVerified createdAt")
        .lean();
      
      const verifiedUsers = referredUsers.filter(u => u.isVerified);
      const contributorCount = verifiedUsers.filter(u => u.roles.includes("contributor") || u.role === "contributor").length;
      const projectAdminCount = verifiedUsers.filter(u => u.roles.includes("project-admin") || u.role === "project-admin").length;
      const generalCount = verifiedUsers.length;
      
      userObj.referralStats = {
        verifiedSignups: generalCount,
        contributors: contributorCount,
        projectAdmins: projectAdminCount,
      };

      userObj.referredUsersList = referredUsers.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        roles: u.roles,
        isVerified: u.isVerified,
        createdAt: u.createdAt
      }));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating profile details",
    });
  }
};

module.exports = {
  googleCallback,
  getMe,
  joinCommunity,
  logout,
  register,
  verifyOtp,
  resendOtp,
  login,
  applyReferral,
  forgotPassword,
  resetPassword,
  updateProfile,
};

