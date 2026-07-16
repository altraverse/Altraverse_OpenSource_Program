const express = require("express");
const router = express.Router();
const { subscribeNewsletter } = require("../controllers/newsletter.controller");
const { sensitiveLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/subscribe", sensitiveLimiter, subscribeNewsletter);

module.exports = router;
