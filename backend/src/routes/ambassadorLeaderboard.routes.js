const express = require("express");
const router = express.Router();
const { getAmbassadorLeaderboard } = require("../controllers/ambassadorLeaderboard.controller");

// Public endpoint to get ambassador rankings
router.get("/", getAmbassadorLeaderboard);

module.exports = router;
