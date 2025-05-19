// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");
const config = require("../config/env");

/**
 * Protect routes - Authentication middleware
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not found with this token",
      });
    }

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return next(error);
  }
};
