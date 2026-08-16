const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false, // Optional for Google OAuth users
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
    },

    resetPasswordOtp: {
      type: String,
      default: "",
    },

    resetPasswordOtpExpires: {
      type: Date,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "contributor", "ambassador", "project-admin", "sponsor", "admin", "mentor"],
      default: "user",
    },

    roles: {
      type: [String],
      default: ["user"],
    },

    isCommunityJoined: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    college: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    githubConnected: {
      type: Boolean,
      default: false,
    },

    githubUsername: {
      type: String,
      default: "",
    },

    points: {
      type: Number,
      default: 0,
    },

    pointsHistory: {
      type: [
        {
          points: {
            type: Number,
            required: true,
          },
          reason: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },

    solvedIssuesCount: {
      type: Number,
      default: 0,
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    referredBy: {
      type: String,
      default: "",
    },

    referralsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Hash password before saving if it has been modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

