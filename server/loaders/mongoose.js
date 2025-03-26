import mongoose from "mongoose";
import { logger } from "../config/logger.js";
import environment from "../config/environment.js";

export default async () => {
  try {
    const connection = await mongoose.connect(environment.mongoUri);
    logger.info("Connected to MongoDB successfully");
    return connection;
  } catch (err) {
    logger.error("MongoDB connection error", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
};
