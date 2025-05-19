// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { connect } = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");
const interviewRoutes = require("./routes/interviewRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connect();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: "*" })); // Enable CORS
app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
); // HTTP request logging

// Routes
app.use("/api/interviews", interviewRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
  // Don't exit the process in production, just log the error
});

module.exports = app; // Export for testing
