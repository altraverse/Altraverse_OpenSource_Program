const mongoose = require("mongoose");

const roleApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleId: {
      type: String,
      enum: ["contributor", "ambassador", "project-admin", "sponsor"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    referredBy: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    techStack: {
      type: String,
      trim: true,
    },
    projectName: {
      type: String,
      trim: true,
    },
    repoUrl: {
      type: String,
      trim: true,
    },
    projects: [
      {
        projectName: { type: String, trim: true },
        repoUrl: { type: String, trim: true }
      }
    ],
    company: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      trim: true,
    },
    motivation: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoleApplication", roleApplicationSchema);
