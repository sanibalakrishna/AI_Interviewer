// services/interviewService.js
const Interview = require("../models/Interview");
const logger = require("../config/logger");

/**
 * Start a new interview
 * @param {Object} user - The user object
 * @param {String} jobDescription - The job description
 * @param {String} resumeUrl - The URL to the resume file
 * @param {String} resumeText - The parsed resume text
 * @returns {Promise<Object>} - The created interview
 */
exports.startInterview = async (
  user,
  jobDescription,
  resumeUrl,
  resumeText
) => {
  try {
    const interview = await Interview.create({
      user: user._id,
      jobDescription,
      resumeUrl,
      resumeText,
      status: "active",
      transcript: [],
    });

    return interview;
  } catch (error) {
    logger.error("Error starting interview:", error);
    throw error;
  }
};

/**
 * End an interview
 * @param {String} interviewId - The interview ID
 * @returns {Promise<Object>} - The updated interview
 */
exports.endInterview = async (interviewId) => {
  try {
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error(`Interview not found with ID: ${interviewId}`);
    }

    interview.status = "completed";
    interview.endTime = Date.now();
    await interview.save();

    return interview;
  } catch (error) {
    logger.error(`Error ending interview ${interviewId}:`, error);
    throw error;
  }
};

/**
 * Add a message to the interview transcript
 * @param {String} interviewId - The interview ID
 * @param {String} role - The role (interviewer or candidate)
 * @param {String} content - The message content
 * @returns {Promise<Object>} - The updated interview
 */
exports.addMessage = async (interviewId, role, content) => {
  try {
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error(`Interview not found with ID: ${interviewId}`);
    }

    if (interview.status !== "active") {
      throw new Error("This interview has already ended");
    }

    interview.transcript.push({
      role,
      content,
      timestamp: Date.now(),
    });

    await interview.save();
    return interview;
  } catch (error) {
    logger.error(`Error adding message to interview ${interviewId}:`, error);
    throw error;
  }
};
