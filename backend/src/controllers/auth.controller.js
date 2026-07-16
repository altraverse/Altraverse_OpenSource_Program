const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const { generateOTP, sendOTPEmail } = require("../utils/email.utils");

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
  res.status(200).json({
    success: true,
    user: req.user,
  });
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

module.exports = {
  googleCallback,
  getMe,
  joinCommunity,
  logout,
  register,
  verifyOtp,
  resendOtp,
  login,
};
