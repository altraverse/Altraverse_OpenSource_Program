const crypto = require("crypto");
const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const { fetchRepoDetails } = require("../utils/github.utils");

/**
 * timing-safe signature verification for GitHub webhooks
 */
const verifySignature = (rawBody, secret, signatureHeader) => {
  if (!signatureHeader) return false;

  const [algorithm, signature] = signatureHeader.split("=");
  if (algorithm !== "sha256" || !signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
};

/**
 * Helper to determine difficulty and points from labels array in payload
 */
const parseDifficultyAndPoints = (labels) => {
  const labelNames = (labels || []).map((l) => l.name.toLowerCase());
  
  if (labelNames.some((l) => l.includes("easy") || l.includes("good first issue") || l.includes("beginner"))) {
    return { difficulty: "Easy", points: 50 };
  }
  if (labelNames.some((l) => l.includes("hard") || l.includes("advanced") || l.includes("complex"))) {
    return { difficulty: "Hard", points: 150 };
  }
  
  return { difficulty: "Medium", points: 100 };
};

/**
 * Format relative date display
 */
const formatRelativeDate = (dateString) => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

/**
 * POST /api/webhooks/github
 * Handle GitHub webhook payloads
 */
const handleGithubWebhook = async (req, res) => {
  const signatureHeader = req.headers["x-hub-signature-256"];
  const event = req.headers["x-github-event"];

  if (!event) {
    return res.status(400).json({ success: false, message: "Missing GitHub Event header" });
  }

  const payload = req.body;
  if (!payload || !payload.repository) {
    return res.status(400).json({ success: false, message: "Invalid webhook payload structure" });
  }

  const repoName = payload.repository.name;
  const repoOwner = payload.repository.owner.login;

  try {
    // 1. Locate the project associated with this repository
    const project = await Project.findOne({
      githubOwner: { $regex: new RegExp(`^${repoOwner}$`, "i") },
      githubRepo: { $regex: new RegExp(`^${repoName}$`, "i") },
    });

    if (!project) {
      console.warn(`[Webhook] No project found matching repository ${repoOwner}/${repoName}`);
      return res.status(404).json({ success: false, message: "Project not registered on this platform" });
    }

    // 2. Validate webhook signature using the project's unique webhookSecret
    if (!req.rawBody) {
      console.error("[Webhook] Raw body is missing. Verify middleware configuration in server.js.");
      return res.status(500).json({ success: false, message: "Internal server body parsing configuration error" });
    }

    const isValid = verifySignature(req.rawBody, project.webhookSecret, signatureHeader);
    if (!isValid) {
      console.warn(`[Webhook] Invalid signature received for project ${project.title}`);
      return res.status(401).json({ success: false, message: "Invalid signature verification" });
    }

    console.log(`[Webhook] Processing event '${event}' for project '${project.title}' (${repoOwner}/${repoName})`);

    // 3. Process event types
    if (event === "issues") {
      const action = payload.action;
      const gitIssue = payload.issue;

      if (!gitIssue) {
        return res.status(400).json({ success: false, message: "Missing issue object in payload" });
      }

      if (action === "opened" || action === "reopened" || action === "edited") {
        const { difficulty, points } = parseDifficultyAndPoints(gitIssue.labels);
        
        await Issue.findOneAndUpdate(
          { projectId: project._id, number: gitIssue.number },
          {
            githubIssueId: gitIssue.id,
            title: gitIssue.title,
            body: gitIssue.body || "",
            difficulty,
            points,
            status: gitIssue.state === "closed" ? "Closed" : "Open",
            date: formatRelativeDate(gitIssue.created_at),
            link: gitIssue.html_url,
          },
          { upsert: true, new: true }
        );
        console.log(`[Webhook] Synced issue #${gitIssue.number} (${action})`);

      } else if (action === "closed") {
        await Issue.findOneAndUpdate(
          { projectId: project._id, number: gitIssue.number },
          { status: "Closed" }
        );
        console.log(`[Webhook] Closed issue #${gitIssue.number}`);

      } else if (action === "deleted") {
        await Issue.deleteOne({ projectId: project._id, number: gitIssue.number });
        console.log(`[Webhook] Deleted issue #${gitIssue.number}`);
      }

    } else if (event === "watch" || event === "fork") {
      // Refresh stars and forks directly from the GitHub API to ensure accurate counts
      try {
        const freshStats = await fetchRepoDetails(project.githubOwner, project.githubRepo);
        project.stars = freshStats.stars;
        project.forks = freshStats.forks;
        await project.save();
        console.log(`[Webhook] Synced stats for ${project.title} - Stars: ${project.stars}, Forks: ${project.forks}`);
      } catch (err) {
        console.error(`[Webhook] Failed to refresh stats for ${project.title}:`, err.message);
      }
    }

    res.status(200).json({ success: true, message: "Webhook event processed and synchronized successfully" });
  } catch (error) {
    console.error("[Webhook Error]:", error);
    res.status(500).json({ success: false, message: "Server error occurred during webhook processing" });
  }
};

module.exports = {
  handleGithubWebhook,
};
