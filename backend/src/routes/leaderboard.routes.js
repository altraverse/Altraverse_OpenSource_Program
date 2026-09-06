const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { getLeaderboard, syncLeaderboard } = require("../controllers/leaderboard.controller");

// Middleware to optionally attach logged-in user to request
const optionalProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-__v -password");
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Proceed as unauthenticated
  }
  next();
};

// Public leaderboard routes
router.get("/", getLeaderboard);
router.post("/sync", optionalProtect, syncLeaderboard);

module.exports = router;
