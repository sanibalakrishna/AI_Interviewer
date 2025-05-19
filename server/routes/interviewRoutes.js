// routes/interviewRoutes.js
const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

// Create a new interview
router.post("/", protect, interviewController.createInterview);

// Get all interviews for the current user
router.get("/", protect, interviewController.getInterviews);

// Get a specific interview
router.get("/:id", protect, interviewController.getInterview);

// Send a message during an interview
router.post("/:id/message", protect, interviewController.sendMessage);

// End an interview and generate feedback
router.post("/:id/end", protect, interviewController.endInterview);

// Get feedback for an interview
router.get("/:id/feedback", protect, interviewController.getFeedback);

module.exports = router;
