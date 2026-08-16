const User = require("../models/user.model");

/**
 * Get Ranked Ambassadors for the Leaderboard
 * GET /api/leaderboard/ambassador
 */
const getAmbassadorLeaderboard = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 0; // 0 means retrieve all

    // Fetch users with ambassador role who have > 0 points
    const query = {
      $or: [
        { role: "ambassador" },
        { roles: "ambassador" }
      ],
      points: { $gt: 0 }
    };

    let mongoQuery = User.find(query, "name avatar points referralsCount referralCode role")
      .sort({ points: -1, referralsCount: -1 });

    if (limit > 0) {
      mongoQuery = mongoQuery.skip(skip).limit(limit);
    } else {
      mongoQuery = mongoQuery.skip(skip);
    }

    const ambassadors = await mongoQuery.lean();

    // Assign rank
    const rankedAmbassadors = ambassadors.map((user, index) => ({
      rank: index + 1 + skip,
      id: user._id,
      name: user.name,
      avatar: user.avatar || "",
      points: user.points || 0,
      commits: user.referralsCount || 0, // Reuse 'commits' mapping for display invites count
      referralCode: user.referralCode || "",
      role: "Ambassador"
    }));

    const totalCount = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      leaderboard: rankedAmbassadors,
      hasMore: limit > 0 ? (skip + ambassadors.length < totalCount) : false,
      totalCount
    });
  } catch (error) {
    console.error("Get ambassador leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load ambassador leaderboard data"
    });
  }
};

module.exports = {
  getAmbassadorLeaderboard
};
