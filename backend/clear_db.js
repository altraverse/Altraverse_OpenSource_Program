const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const clearDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("ERROR: MONGO_URI is missing from your .env file!");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);

    if (collectionNames.length === 0) {
      console.log("Database is already empty.");
      process.exit(0);
    }

    for (const name of collectionNames) {
      console.log(`Clearing collection: ${name}...`);
      await collections[name].deleteMany({});
    }

    console.log("\nSuccess: Database has been cleared and reset!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to clear database:", err);
    process.exit(1);
  }
};

clearDatabase();
