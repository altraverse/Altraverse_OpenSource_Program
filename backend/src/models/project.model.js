const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      enum: ["violet", "emerald", "cyan"],
      default: "violet",
    },
    points: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    githubOwner: {
      type: String,
      required: true,
      trim: true,
    },
    githubRepo: {
      type: String,
      required: true,
      trim: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    projectAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    webhookSecret: {
      type: String,
      required: true,
    },
    detailedStats: {
      contributors: {
        type: Number,
        default: 0,
      },
      openIssues: {
        type: Number,
        default: 0,
      },
      prsMerged: {
        type: Number,
        default: 0,
      },
      totalCommits: {
        type: Number,
        default: 0,
      },
      linesOfCode: {
        type: String,
        default: "0",
      },
      techStack: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
