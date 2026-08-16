const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const passport = require("passport");
const {
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
} = require("../controllers/auth.controller");

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallback,
);

// Local Email/Password with OTP & JWT Authentication
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Authenticated session state
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/join-community", protect, joinCommunity);
router.post("/apply-referral", protect, applyReferral);
router.post("/logout", protect, logout);

module.exports = router;
