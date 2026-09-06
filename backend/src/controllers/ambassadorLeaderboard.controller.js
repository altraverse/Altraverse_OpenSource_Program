const User = require("../models/user.model");

/**
 * Helper to calculate ambassador-specific referral points
 */
const getAmbassadorPoints = (user) => {
  let ap = 0;
  if (user.pointsHistory && Array.isArray(user.pointsHistory) && user.pointsHistory.length > 0) {
    for (const h of user.pointsHistory) {
      const r = (h.reason || "").toLowerCase();
      if (
        r.includes("referral") ||
        r.includes("ambassador") ||
        r.includes("invite") ||
        r.includes("signup of") ||
        r.includes("role to") ||
        r.includes("linkedin") ||
        r.includes("badge")
      ) {
        ap += h.points || 0;
      }
    }
  }

  // Fallback to referralsCount * 20 if pointsHistory was not logged
  if (ap === 0 && (user.referralsCount || 0) > 0) {
    ap = (user.referralsCount || 0) * 20;
  }

  // If user has only ambassador role and has points
  const isContributor = user.role === "contributor" || (user.roles && user.roles.includes("contributor")) || (user.solvedIssuesCount || 0) > 0;
  if (ap === 0 && !isContributor && (user.role === "ambassador" || user.roles?.includes("ambassador"))) {
    ap = user.points || 0;
  }

  return ap;
};

/**
 * Get Ranked Ambassadors for the Leaderboard
 * GET /api/leaderboard/ambassador
 */
const getAmbassadorLeaderboard = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 0; // 0 means retrieve all

    // Fetch users with ambassador role
    const query = {
      $or: [
        { role: "ambassador" },
        { roles: "ambassador" },
        { referralsCount: { $gt: 0 } },
      ],
    };

    const users = await User.find(
      query,
      "name avatar points referralsCount referralCode role roles pointsHistory"
    ).lean();

    // Calculate ambassador points and filter for active ambassadors
    const validAmbassadors = users
      .map((user) => {
        const ambassadorPoints = getAmbassadorPoints(user);
        return {
          id: user._id,
          name: user.name,
          avatar: user.avatar || "",
          points: ambassadorPoints,
          commits: user.referralsCount || 0, // 'commits' maps to invites count
          referralCode: user.referralCode || "",
          role: "Ambassador",
        };
      })
      .filter((u) => u.points > 0 || u.commits > 0);

    // Sort descending by points, then by referrals
    validAmbassadors.sort((a, b) => b.points - a.points || b.commits - a.commits);

    const totalCount = validAmbassadors.length;

    // Apply pagination slice
    const paginatedSlice = limit > 0
      ? validAmbassadors.slice(skip, skip + limit)
      : skip > 0
      ? validAmbassadors.slice(skip)
      : validAmbassadors;

    // Assign dynamic 1-indexed ranks
    const rankedAmbassadors = paginatedSlice.map((u, idx) => ({
      ...u,
      rank: skip + idx + 1,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedAmbassadors,
      hasMore: limit > 0 ? skip + paginatedSlice.length < totalCount : false,
      totalCount,
    });
  } catch (error) {
    console.error("Get ambassador leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load ambassador leaderboard data",
    });
  }
};

module.exports = {
  getAmbassadorLeaderboard,
};

