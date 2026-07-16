const express = require("express");
const router = express.Router();
const { handleGithubWebhook } = require("../controllers/webhook.controller");

// Endpoint for receiving webhook payloads from GitHub
router.post("/", handleGithubWebhook);

module.exports = router;
