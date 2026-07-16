const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Cookies received:", req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Dynamic sync of user.roles array with approved applications
    try {
      const RoleApplication = require("../models/role.model");
      const MentorApplication = require("../models/mentor.model");

      const rolesSet = new Set(user.roles && user.roles.length > 0 ? user.roles : ["user"]);
      if (user.role) {
        rolesSet.add(user.role);
      }

      // Query approved general role applications
      const approvedRoles = await RoleApplication.find({ userId: user._id, status: "approved" });
      approvedRoles.forEach((app) => rolesSet.add(app.roleId));

      // Query approved mentor application
      const approvedMentor = await MentorApplication.findOne({ userId: user._id, status: "approved" });
      if (approvedMentor) {
        rolesSet.add("mentor");
      }

      const compiledRoles = Array.from(rolesSet);

      // If roles list changed, save to MongoDB
      if (JSON.stringify(user.roles) !== JSON.stringify(compiledRoles)) {
        user.roles = compiledRoles;
        await user.save();
      }
    } catch (syncErr) {
      console.error("[Roles Sync Error] Failed to sync user roles:", syncErr.message);
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

module.exports = protect;
