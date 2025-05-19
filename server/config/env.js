// config/env.js
require("dotenv").config();

/**
 * Environment variables configuration with validations
 */
const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  logLevel: process.env.LOG_LEVEL || "info",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "GEMINI_API_KEY"];
const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

module.exports = config;
