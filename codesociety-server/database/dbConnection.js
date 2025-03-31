import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    // Attempt to connect to MongoDB using the URI from .env
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error while connecting with the database:", error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

// Export the DBConnection function
export { DBConnection };
