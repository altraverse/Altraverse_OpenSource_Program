const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const passport = require("./src/config/passport");

const authRoutes = require("./src/routes/auth.routes");
const mentorRoutes = require("./src/routes/mentor.routes");
const roleRoutes = require("./src/routes/role.routes");
const projectRoutes = require("./src/routes/project.routes");
const webhookRoutes = require("./src/routes/webhook.routes");
const supportRoutes = require("./src/routes/support.routes");
const newsletterRoutes = require("./src/routes/newsletter.routes");
const ambassadorLeaderboardRoutes = require("./src/routes/ambassadorLeaderboard.routes");

connectDB().then(() => {
  backfillPointsHistory();
});

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin: ${origin} not matched in allowed origins list.`);
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

// Capture raw body for GitHub webhook signature verification
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Altraverse Open Source Platform API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/webhooks/github", webhookRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/leaderboard/ambassador", ambassadorLeaderboardRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const backfillPointsHistory = async () => {
  try {
    const User = require("./src/models/user.model");
    const RoleApplication = require("./src/models/role.model");

    console.log("[Backfill] Starting points history backfill...");
    const ambassadors = await User.find({
      $or: [
        { role: "ambassador" },
        { roles: "ambassador" },
        { points: { $gt: 0 } }
      ]
    });

    for (const amb of ambassadors) {
      // Migrate existing legacy reasons to "LinkedIn Post Sharing"
      if (amb.pointsHistory && amb.pointsHistory.length > 0) {
        let updated = false;
        for (let hist of amb.pointsHistory) {
          if (hist.reason === "Legacy / Pre-existing Points") {
            hist.reason = "LinkedIn Post Sharing";
            updated = true;
          }
        }
        if (updated) {
          amb.markModified("pointsHistory");
          await amb.save();
          console.log(`[Backfill] Updated legacy reason to 'LinkedIn Post Sharing' for ${amb.name}`);
        }
      }

      if (amb.points > 0 && (!amb.pointsHistory || amb.pointsHistory.length === 0)) {
        console.log(`[Backfill] Reconstructing points history for ${amb.name} (${amb.points} points)...`);
        const reconstructedHistory = [];
        
        if (amb.referralCode) {
          // Find any signups referred by them
          const referredSignups = await User.find({
            referredBy: amb.referralCode,
            isVerified: true
          }).lean();

          for (const signupUser of referredSignups) {
            let pts = 20;
            reconstructedHistory.push({
              points: pts,
              reason: `${pts} points for referral signup of ${signupUser.name}`,
              createdAt: signupUser.createdAt || new Date()
            });
          }
        }

        const sumReconstructed = reconstructedHistory.reduce((sum, item) => sum + item.points, 0);
        const diff = amb.points - sumReconstructed;

        if (diff > 0) {
          reconstructedHistory.unshift({
            points: diff,
            reason: "LinkedIn Post Sharing",
            createdAt: amb.createdAt || new Date()
          });
        }

        amb.pointsHistory = reconstructedHistory;
        await amb.save();
        console.log(`[Backfill] Reconstructed points history for ${amb.name}. Total logs: ${reconstructedHistory.length}`);
      }
    }
    console.log("[Backfill] Points history backfill check complete.");
  } catch (error) {
    console.error("[Backfill Error] Failed to run points history backfill:", error);
  }
};

module.exports = app;
