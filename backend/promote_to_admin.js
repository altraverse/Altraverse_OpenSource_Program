const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/user.model");

// Load env variables
dotenv.config();

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB.");

    // Enter the email address you want to promote to admin
    const emailToPromote = "parkhiom50@gmail.com";

    const user = await User.findOneAndUpdate(
      { email: emailToPromote.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`\n🎉 Success! User "${user.name}" (${emailToPromote}) has been promoted to "admin".`);
      console.log("You can now log in with this account and access the /admin dashboard.");
    } else {
      console.log(`\n❌ Error: User with email "${emailToPromote}" was not found in the database.`);
      console.log("Please make sure you have registered this account on the website first.");
    }

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
