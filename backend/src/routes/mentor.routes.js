const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { applyMentor } = require("../controllers/mentor.controller");

// Route to submit mentor applications (protected)
router.post("/apply", protect, applyMentor);

module.exports = router;
