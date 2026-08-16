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
  getApprovedUsers,
  awardPoints,
  getUserDetailsForAdmin,
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
router.get("/admin/approved-users", protect, allowRoles("admin"), getApprovedUsers);
router.post("/admin/award-points", protect, allowRoles("admin"), awardPoints);
router.get("/admin/users/:userId/details", protect, allowRoles("admin"), getUserDetailsForAdmin);

module.exports = router;
