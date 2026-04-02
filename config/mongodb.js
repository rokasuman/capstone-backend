import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Mongo URL:", process.env.MONGODB_URL);

    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Database is Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;