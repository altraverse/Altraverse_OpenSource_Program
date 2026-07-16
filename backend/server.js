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

connectDB();

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
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));
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

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
