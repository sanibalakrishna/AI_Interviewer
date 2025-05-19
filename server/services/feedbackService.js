// services/feedbackService.js
const Interview = require("../models/Interview");
const Feedback = require("../models/Feedback");
const aiService = require("./aiService");
const logger = require("../config/logger");

/**
 * Generate feedback for an interview
 * @param {String} interviewId - The interview ID
 * @returns {Promise<Object>} - The generated feedback
 */
exports.generateFeedback = async (interviewId) => {
  try {
    // Get the interview
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error(`Interview not found with ID: ${interviewId}`);
    }

    // Check if interview is completed
    if (interview.status !== "completed") {
      throw new Error(`Interview ${interviewId} is not completed`);
    }

    // Generate evaluation using AI service
    const evaluation = await aiService.generateEvaluation(
      interview.jobDescription,
      interview.resumeText,
      interview.transcript
    );

    // Create feedback
    const feedback = await Feedback.create({
      interview: interviewId,
      user: interview.user,
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      areasForImprovement: evaluation.areasForImprovement,
      technicalAssessment: evaluation.technicalAssessment,
      communicationAssessment: evaluation.communicationAssessment,
      jobFitAssessment: evaluation.jobFitAssessment,
      recommendedResources: evaluation.recommendedResources,
      detailedFeedback: evaluation.detailedFeedback,
    });

    // Update interview with feedback reference
    interview.feedback = feedback._id;
    await interview.save();

    return feedback;
  } catch (error) {
    logger.error(
      `Error generating feedback for interview ${interviewId}:`,
      error
    );
    throw error;
  }
};
