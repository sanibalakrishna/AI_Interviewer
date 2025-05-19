// controllers/interviewController.js
const Interview = require("../models/Interview");
const Feedback = require("../models/Feedback");
const logger = require("../config/logger");
const interviewService = require("../services/interviewService");
const aiService = require("../services/aiService");
const feedbackService = require("../services/feedbackService");

/**
 * @desc    Create a new interview
 * @route   POST /api/interviews
 * @access  Private
 */
exports.createInterview = async (req, res, next) => {
  try {
    const { jobDescription, resumeUrl, resumeText } = req.body;

    // Validate input
    if (!jobDescription || !resumeUrl || !resumeText) {
      return res.status(400).json({
        success: false,
        error: "Please provide job description, resume URL, and resume text",
      });
    }

    // Create interview
    const interview = await Interview.create({
      user: req.user.id,
      jobDescription,
      resumeUrl,
      resumeText,
      status: "active",
      transcript: [],
    });

    // Generate first interview question
    const firstQuestion = await aiService.generateFirstQuestion(
      jobDescription,
      resumeText
    );

    // Add first question to transcript
    interview.transcript.push({
      role: "interviewer",
      content: firstQuestion,
      timestamp: Date.now(),
    });

    await interview.save();

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all interviews for current user
 * @route   GET /api/interviews
 * @access  Private
 */
exports.getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .select("_id status startTime endTime duration createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific interview
 * @route   GET /api/interviews/:id
 * @access  Private
 */
exports.getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("feedback");

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message during an interview
 * @route   POST /api/interviews/:id/message
 * @access  Private
 */
exports.sendMessage = async (req, res, next) => {
  try {
    // Get the interview
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: "Interview not found",
      });
    }

    // Check if interview is active
    if (interview.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "This interview has already ended",
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Please provide a message",
      });
    }

    // Add candidate message to transcript
    interview.transcript.push({
      role: "candidate",
      content: message,
      timestamp: Date.now(),
    });

    await interview.save();

    // Generate AI response based on the conversation history
    const aiResponse = await aiService.generateResponse(
      interview.jobDescription,
      interview.resumeText,
      interview.transcript
    );

    console.log(aiResponse);

    // Add interviewer response to transcript
    interview.transcript.push({
      role: "interviewer",
      content: aiResponse,
      timestamp: Date.now(),
    });

    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        interview,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    End an interview and generate feedback
 * @route   POST /api/interviews/:id/end
 * @access  Private
 */
exports.endInterview = async (req, res, next) => {
  try {
    // Get the interview
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: "Interview not found",
      });
    }

    // Check if interview is already ended
    if (interview.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "This interview has already ended",
      });
    }

    // Update interview status
    interview.status = "completed";
    interview.endTime = Date.now();
    await interview.save();

    // Generate feedback asynchronously
    feedbackService
      .generateFeedback(interview._id)
      .then(() => {
        logger.info(`Feedback generated for interview ${interview._id}`);
      })
      .catch((error) => {
        logger.error(
          `Error generating feedback for interview ${interview._id}:`,
          error
        );
      });

    res.status(200).json({
      success: true,
      data: {
        message: "Interview ended. Feedback is being generated.",
        interview,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get feedback for an interview
 * @route   GET /api/interviews/:id/feedback
 * @access  Private
 */
exports.getFeedback = async (req, res, next) => {
  try {
    // Get the interview
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: "Interview not found",
      });
    }

    // Check if feedback exists
    if (!interview.feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not available yet",
      });
    }

    // Get feedback
    const feedback = await Feedback.findById(interview.feedback);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};
