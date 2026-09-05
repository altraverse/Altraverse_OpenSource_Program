const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const {
  getAllProjects,
  getProjectById,
  createProject,
  getProjectAdmins,
  toggleProjectActive,
  updateProject,
  getWebhookConfig,
  regenerateWebhookSecret,
} = require("../controllers/project.controller");

// Public endpoints to display projects and details
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin-only endpoints to manage projects
router.post("/", protect, allowRoles("admin"), createProject);
router.put("/:id", protect, allowRoles("admin"), updateProject);
router.patch("/:id/toggle-active", protect, allowRoles("admin"), toggleProjectActive);
router.get("/admins/list", protect, allowRoles("admin"), getProjectAdmins);
router.get("/:id/webhook-config", protect, allowRoles("admin"), getWebhookConfig);
router.post("/:id/regenerate-webhook-secret", protect, allowRoles("admin"), regenerateWebhookSecret);

module.exports = router;

