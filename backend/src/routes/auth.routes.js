const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const passport = require("passport");
const {
  googleCallback,
  getMe,
  joinCommunity,
  logout,
} = require("../controllers/auth.controller");

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

router.get("/me", protect, getMe);

router.post("/join-community", protect, joinCommunity);

router.post("/logout", logout);

module.exports = router;
