const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const {
  createSupportRequest,
  getSupportTickets,
  updateTicketStatus,
} = require("../controllers/support.controller");

// Middleware to optionally authenticate a user (so guests can still submit requests)
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
    // Log error, but proceed since it's optional auth
    console.log("Optional auth error (proceeding as guest):", error.message);
  }
  next();
};

const { sensitiveLimiter } = require("../middleware/rateLimiter.middleware");

// Route to submit support request (accessible by guests and logged-in users)
router.post("/", optionalProtect, sensitiveLimiter, createSupportRequest);

// Admin-only routes
router.get("/admin/tickets", protect, allowRoles("admin"), getSupportTickets);
router.put("/admin/tickets/:id", protect, allowRoles("admin"), updateTicketStatus);

module.exports = router;
