const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboard.controller");

// Public leaderboard route
router.get("/", getLeaderboard);

module.exports = router;
