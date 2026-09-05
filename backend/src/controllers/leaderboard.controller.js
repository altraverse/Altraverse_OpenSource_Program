const User = require("../models/user.model");

/**
 * Get Ranked Contributors for the Leaderboard
 * GET /api/leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    // Fetch users with contributor role
    const contributors = await User.find(
      {
        $or: [
          { role: "contributor" },
          { roles: "contributor" }
        ],
        points: { $gt: 0 }
      },
      "name githubUsername avatar points solvedIssuesCount role"
    )
      .sort({ points: -1, solvedIssuesCount: -1 })
      .lean();

    // Assign rank
    const rankedContributors = contributors.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      githubUsername: user.githubUsername || "",
      avatar: user.avatar || "",
      points: user.points || 0,
      commits: user.solvedIssuesCount || 0, // Maps to merged PRs/issues solved for display
      role: "Contributor"
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedContributors
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load leaderboard data"
    });
  }
};

module.exports = {
  getLeaderboard
};
