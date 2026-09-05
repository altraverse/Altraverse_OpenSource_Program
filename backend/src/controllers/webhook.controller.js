const crypto = require("crypto");
const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const User = require("../models/user.model");
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
 * Helper to determine difficulty and points from title and labels array in payload
 */
const parseDifficultyAndPoints = (title, labels) => {
  // 1. Try to parse points from the title suffix (e.g. "- 10", "- 20", "- 30", "- 40", "- 50")
  const match = String(title || "").match(/-\s*(\d+)\s*$/);
  if (match) {
    const pts = parseInt(match[1]);
    if ([10, 20, 30, 40, 50].includes(pts)) {
      let difficulty = "Medium";
      if (pts <= 20) difficulty = "Easy";
      else if (pts >= 40) difficulty = "Hard";
      return { difficulty, points: pts };
    }
  }

  // 2. Fall back to label-based parsing on 10/30/50 scale
  const labelNames = (labels || []).map((l) => l.name.toLowerCase());
  
  if (labelNames.some((l) => l.includes("easy") || l.includes("good first issue") || l.includes("beginner"))) {
    return { difficulty: "Easy", points: 10 };
  }
  if (labelNames.some((l) => l.includes("hard") || l.includes("advanced") || l.includes("complex"))) {
    return { difficulty: "Hard", points: 50 };
  }
  
  return { difficulty: "Medium", points: 30 };
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

    // Handle GitHub Webhook Ping event (sent when testing/saving Webhook in GitHub repo settings)
    if (event === "ping") {
      console.log(`[Webhook] Ping test successful for project '${project.title}'`);
      return res.status(200).json({ success: true, message: "Pong! Webhook configured successfully." });
    }

    // 3. Process event types
    if (event === "issues") {
      const action = payload.action;
      const gitIssue = payload.issue;

      if (!gitIssue) {
        return res.status(400).json({ success: false, message: "Missing issue object in payload" });
      }

      if (action === "opened" || action === "reopened" || action === "edited") {
        const { difficulty, points } = parseDifficultyAndPoints(gitIssue.title, gitIssue.labels);
        
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

    } else if (event === "pull_request") {
      const action = payload.action;
      const pr = payload.pull_request;

      if (action === "closed" && pr && pr.merged) {
        const githubUsername = pr.user.login;
        const prBody = pr.body || "";
        const prTitle = pr.title || "";

        console.log(`[Webhook] Processing merged PR #${pr.number} by ${githubUsername} for project ${project.title}`);

        // Find linked issues in PR body & title using common GitHub closing keywords
        const issueNumbers = [];
        const linkRegex = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#(\d+)/gi;
        let match;
        const textToSearch = `${prTitle} ${prBody}`;
        while ((match = linkRegex.exec(textToSearch)) !== null) {
          const num = parseInt(match[1]);
          if (!issueNumbers.includes(num)) {
            issueNumbers.push(num);
          }
        }

        console.log(`[Webhook] Detected linked issue numbers: ${issueNumbers.join(", ")}`);

        let pointsEarned = 0;
        let closedIssuesCount = 0;

        for (const issueNum of issueNumbers) {
          const issue = await Issue.findOne({ projectId: project._id, number: issueNum });
          if (issue) {
            if (issue.status !== "Closed") {
              issue.status = "Closed";
              await issue.save();
              pointsEarned += issue.points || 0;
              closedIssuesCount++;
            }
          }
        }

        // Award points to the contributor if registered
        if (pointsEarned > 0) {
          const contributor = await User.findOne({
            githubUsername: { $regex: new RegExp(`^${githubUsername}$`, "i") },
          });

          if (contributor) {
            contributor.points = (contributor.points || 0) + pointsEarned;
            contributor.solvedIssuesCount = (contributor.solvedIssuesCount || 0) + closedIssuesCount;
            
            if (!contributor.pointsHistory) contributor.pointsHistory = [];
            contributor.pointsHistory.push({
              points: pointsEarned,
              reason: `Merged PR #${pr.number} in ${project.title} (${closedIssuesCount} issues resolved)`,
              createdAt: new Date()
            });

            await contributor.save();
            console.log(`[Webhook] Awarded ${pointsEarned} points to user ${contributor.name} (${githubUsername}). New balance: ${contributor.points}`);
          } else {
            console.warn(`[Webhook] PR contributor '${githubUsername}' is not registered on the platform. Points not awarded.`);
          }
        }

        // Increment project stats (prsMerged)
        project.detailedStats = project.detailedStats || {};
        project.detailedStats.prsMerged = (project.detailedStats.prsMerged || 0) + 1;
        await project.save();
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
