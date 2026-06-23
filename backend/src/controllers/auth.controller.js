const generateToken = require("../utils/generateToken");

const googleCallback = (req, res) => {
  //   console.log("Google callback user:", req.user);

  const token = generateToken(req.user._id);

  //   console.log("Generated token:", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.FRONTEND_URL}/community`);
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const joinCommunity = async (req, res) => {
  req.user.isCommunityJoined = true;
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Community joined successfully",
    user: req.user,
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  googleCallback,
  getMe,
  joinCommunity,
  logout,
};
