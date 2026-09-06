const User = require("../models/user.model");
const { syncAllProjectsPullRequests } = require("../utils/sync.utils");

let lastBackgroundSyncTime = 0;
const BACKGROUND_SYNC_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Helper to calculate contributor-specific points from code contributions and merged PRs
 */
const getContributorPoints = (user) => {
  let cp = 0;
  if (user.pointsHistory && Array.isArray(user.pointsHistory) && user.pointsHistory.length > 0) {
    for (const h of user.pointsHistory) {
      const r = (h.reason || "").toLowerCase();
      // Contributor points come from merged pull requests, solved issues, or direct contributor code tasks
      // Exclude ambassador referral bonus rewards like 'points for contributor role to XYZ'
      if (
        (r.includes("merged pr #") || r.includes("pr #") || r.includes("merged pull request") || r.includes("solved issue")) &&
        !r.includes("role to ") &&
        !r.includes("signup of ")
      ) {
        cp += h.points || 0;
      }
    }
  }

  // If user has solved issues recorded but pointsHistory was not logged
  if (cp === 0 && (user.solvedIssuesCount || 0) > 0) {
    cp = user.solvedIssuesCount * 30;
  }

  // If user has only contributor role (no ambassador role) and has points but no specific PR log
  const isAmbassador = user.role === "ambassador" || (user.roles && user.roles.includes("ambassador"));
  if (cp === 0 && !isAmbassador && (user.role === "contributor" || user.roles?.includes("contributor"))) {
    // Only use user.points if they don't have ambassador referral records
    const hasAmbassadorHistory = (user.pointsHistory || []).some((h) => {
      const r = (h.reason || "").toLowerCase();
      return r.includes("referral") || r.includes("signup of") || r.includes("role to");
    });
    if (!hasAmbassadorHistory) {
      cp = user.points || 0;
    }
  }

  return cp;
};

/**
 * Get Ranked Contributors for the Leaderboard
 * GET /api/leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 0; // 0 means retrieve all or initial slice

    // Trigger throttled background sync without blocking response
    const now = Date.now();
    if (now - lastBackgroundSyncTime > BACKGROUND_SYNC_INTERVAL_MS) {
      lastBackgroundSyncTime = now;
      syncAllProjectsPullRequests().catch((err) =>
        console.warn("[Background PR Sync Error]:", err.message)
      );
    }

    // Query candidate contributors
    const query = {
      $or: [
        { role: "contributor" },
        { roles: "contributor" },
        { solvedIssuesCount: { $gt: 0 } },
      ],
    };

    const users = await User.find(
      query,
      "name githubUsername avatar points solvedIssuesCount role roles pointsHistory"
    ).lean();

    // Map and filter for only users with contributor points or merged PRs
    const validContributors = users
      .map((user) => {
        const contributorPoints = getContributorPoints(user);
        return {
          id: user._id,
          name: user.name,
          githubUsername: user.githubUsername || "",
          avatar: user.avatar || "",
          points: contributorPoints,
          commits: user.solvedIssuesCount || 0,
          role: "Contributor",
        };
      })
      .filter((u) => u.points > 0 || u.commits > 0);

    // Sort descending by points, then by commits
    validContributors.sort((a, b) => b.points - a.points || b.commits - a.commits);

    const totalCount = validContributors.length;

    // Apply pagination slice
    const paginatedSlice = limit > 0
      ? validContributors.slice(skip, skip + limit)
      : skip > 0
      ? validContributors.slice(skip)
      : validContributors;

    // Assign dynamic 1-indexed ranks
    const rankedContributors = paginatedSlice.map((u, idx) => ({
      ...u,
      rank: skip + idx + 1,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedContributors,
      hasMore: limit > 0 ? skip + paginatedSlice.length < totalCount : false,
      totalCount,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load leaderboard data",
    });
  }
};

/**
 * On-demand sync of pull requests across all projects
 * POST /api/leaderboard/sync
 */
const syncLeaderboard = async (req, res) => {
  try {
    const syncResult = await syncAllProjectsPullRequests();

    let updatedUser = null;
    if (req.user && req.user._id) {
      updatedUser = await User.findById(req.user._id).select(
        "name email githubUsername avatar points solvedIssuesCount role roles pointsHistory"
      );
    }

    res.status(200).json({
      success: true,
      message: "GitHub PRs and leaderboard rankings synchronized successfully!",
      syncResult,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Sync leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync GitHub pull requests",
    });
  }
};

module.exports = {
  getLeaderboard,
  syncLeaderboard,
};

