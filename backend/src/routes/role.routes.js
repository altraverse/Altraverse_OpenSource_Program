const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const {
  applyRole,
  getMyApplications,
  getAdminApplications,
  approveApplication,
  rejectApplication,
  downloadExcelFile,
} = require("../controllers/role.controller");

const { sensitiveLimiter } = require("../middleware/rateLimiter.middleware");

// Route to submit application (protected)
router.post("/apply", protect, sensitiveLimiter, applyRole);

// Route to check own applications (protected)
router.get("/my-applications", protect, getMyApplications);

// Admin endpoints (protected, admin only)
router.get("/admin/applications", protect, allowRoles("admin"), getAdminApplications);
router.post("/admin/approve", protect, allowRoles("admin"), approveApplication);
router.post("/admin/reject", protect, allowRoles("admin"), rejectApplication);
router.get("/admin/download-excel", protect, allowRoles("admin"), downloadExcelFile);

module.exports = router;
