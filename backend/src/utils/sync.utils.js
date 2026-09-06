const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const User = require("../models/user.model");
const RoleApplication = require("../models/role.model");
const { fetchRepoPullRequests, parseDifficultyAndPoints } = require("./github.utils");

/**
 * Sync merged pull requests for a single project
 */
const syncProjectPullRequests = async (project) => {
  if (!project || !project.githubOwner || !project.githubRepo) {
    return { success: false, reason: "Invalid project github coordinates" };
  }

  try {
    const prsList = await fetchRepoPullRequests(project.githubOwner, project.githubRepo);
    if (!Array.isArray(prsList) || prsList.length === 0) {
      return { success: true, processed: 0 };
    }

    const mergedPrs = prsList.filter((p) => p.status === "Merged");
    let processedCount = 0;

    for (const pr of mergedPrs) {
      const authorLogin = pr.author || pr.user?.login;
      if (!authorLogin || authorLogin === "contributor" || authorLogin.includes("[bot]")) {
        continue;
      }

      const cleanLogin = String(authorLogin).replace(/^@/, "").trim();
      const prTitle = pr.title || "";
      const prBody = pr.body || "";

      // 1. Find linked issue numbers in PR title and description
      const issueNumbers = [];
      const linkRegex = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#(\d+)/gi;
      let match;
      const textToSearch = `${prTitle} ${prBody}`;
      while ((match = linkRegex.exec(textToSearch)) !== null) {
        const num = parseInt(match[1], 10);
        if (!issueNumbers.includes(num)) {
          issueNumbers.push(num);
        }
      }

      let pointsEarned = 0;
      let closedIssuesCount = 0;

      for (const issueNum of issueNumbers) {
        const issue = await Issue.findOne({ projectId: project._id, number: issueNum });
        if (issue) {
          if (issue.status !== "Closed") {
            issue.status = "Closed";
            await issue.save();
          }
          pointsEarned += issue.points || 0;
          closedIssuesCount++;
        }
      }

      // 2. Fall back to title/labels parsing if no linked issue points
      if (pointsEarned === 0) {
        const parsed = parseDifficultyAndPoints(prTitle, pr.labels || []);
        pointsEarned = parsed.points || 30;
        closedIssuesCount = 1;
      }

      // 3. Find registered contributor in MongoDB (flexible regex matching)
      const contributor = await User.findOne({
        $or: [
          { githubUsername: { $regex: new RegExp(`^@?${cleanLogin}$`, "i") } },
          { githubUsername: { $regex: new RegExp(`github\\.com/${cleanLogin}(?:/|$)`, "i") } },
        ],
      });

      if (contributor && pointsEarned > 0) {
        const reasonTag = `PR #${pr.number}`;
        const alreadyAwarded = (contributor.pointsHistory || []).some(
          (h) => h.reason && h.reason.includes(reasonTag) && (h.reason.includes(project.title) || h.reason.includes(project.githubRepo))
        );

        if (!alreadyAwarded) {
          contributor.points = (contributor.points || 0) + pointsEarned;
          contributor.solvedIssuesCount = (contributor.solvedIssuesCount || 0) + (closedIssuesCount || 1);

          // Automatically upgrade & unlock contributor role
          if (!contributor.roles) contributor.roles = ["user"];
          if (!contributor.roles.includes("contributor")) {
            contributor.roles.push("contributor");
          }
          if (contributor.role === "user" || !contributor.role) {
            contributor.role = "contributor";
          }

          // Approve pending role applications for contributor
          await RoleApplication.updateMany(
            { userId: contributor._id, roleId: "contributor", status: "pending" },
            { $set: { status: "approved" } }
          );

          if (!contributor.pointsHistory) contributor.pointsHistory = [];
          contributor.pointsHistory.push({
            points: pointsEarned,
            reason: `Merged PR #${pr.number}: "${prTitle}" in ${project.title} (${closedIssuesCount} issue(s) resolved)`,
            createdAt: new Date(),
          });

          await contributor.save();
          processedCount++;
          console.log(`[Sync] Awarded ${pointsEarned} pts to ${contributor.name} (@${cleanLogin}) for PR #${pr.number}`);
        }
      }
    }

    // Update project stats
    project.detailedStats = project.detailedStats || {};
    project.detailedStats.prsMerged = Math.max(project.detailedStats.prsMerged || 0, mergedPrs.length);
    await project.save();

    return { success: true, processed: processedCount, totalMerged: mergedPrs.length };
  } catch (err) {
    console.error(`[Sync Error] Failed to sync PRs for ${project.title}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Sync pull requests across all active projects
 */
const syncAllProjectsPullRequests = async () => {
  try {
    const projects = await Project.find({ isActive: { $ne: false } });
    const results = [];

    for (const project of projects) {
      const res = await syncProjectPullRequests(project);
      results.push({ projectId: project._id, title: project.title, ...res });
    }

    return { success: true, results };
  } catch (err) {
    console.error("[Sync All Error]:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  syncProjectPullRequests,
  syncAllProjectsPullRequests,
};
