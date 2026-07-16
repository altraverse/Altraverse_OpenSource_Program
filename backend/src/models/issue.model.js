const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    githubIssueId: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    points: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    date: {
      type: String,
      default: "Just now",
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of issue numbers within a project
issueSchema.index({ projectId: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Issue", issueSchema);
