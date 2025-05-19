// services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/env");
const logger = require("../config/logger");

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Format the interview transcript for the AI prompt
 * @param {Array} transcript - The interview transcript
 * @returns {String} - Formatted transcript for prompt
 */
const formatTranscript = (transcript) => {
  return transcript
    .map(
      (message) =>
        `${message.role === "interviewer" ? "Interviewer" : "Candidate"}: ${
          message.content
        }`
    )
    .join("\n\n");
};

/**
 * Generate the first interview question based on resume and job description
 * @param {String} jobDescription - The job description
 * @param {String} resumeText - The parsed resume text
 * @returns {Promise<String>} - First interview question
 */
exports.generateFirstQuestion = async (jobDescription, resumeText) => {
  try {
    const prompt = `
You are an AI interviewer conducting a job interview. Your goal is to assess the candidate's qualifications for the following position:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeText}

Based on the job description and resume, introduce yourself as the interviewer and ask your first question to the candidate. Be professional, courteous, and focused on assessing the candidate's fit for this role. Limit your response to a brief introduction and one clear question.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    logger.error("Error generating first question:", error);
    return "Hello! I'm your AI interviewer today. Could you please tell me about your background and why you're interested in this position?";
  }
};

/**
 * Generate a response based on the conversation history
 * @param {String} jobDescription - The job description
 * @param {String} resumeText - The parsed resume text
 * @param {Array} transcript - The interview transcript
 * @returns {Promise<String>} - AI interviewer's response
 */
exports.generateResponse = async (jobDescription, resumeText, transcript) => {
  try {
    const formattedTranscript = formatTranscript(transcript);

    const prompt = `
You are an AI interviewer conducting a job interview. Your goal is to assess the candidate's qualifications for the following position:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeText}

INTERVIEW TRANSCRIPT SO FAR:
${formattedTranscript}

Based on the candidate's last response, ask a follow-up question that helps you better assess their qualifications, skills, or fit for this role. Be professional, courteous, and focused. Ask only one clear question. Do not repeat questions already asked.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    logger.error("Error generating AI response:", error);
    return "That's interesting. Could you elaborate more on your experience with similar projects or roles?";
  }
};

/**
 * Generate a detailed evaluation of the candidate
 * @param {String} jobDescription - The job description
 * @param {String} resumeText - The parsed resume text
 * @param {Array} transcript - The complete interview transcript
 * @returns {Promise<Object>} - Structured feedback
 */
exports.generateEvaluation = async (jobDescription, resumeText, transcript) => {
  try {
    const formattedTranscript = formatTranscript(transcript);

    const prompt = `
You are an AI interviewer who has just completed a job interview. Your task is to provide a detailed evaluation of the candidate for the following position:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeText}

COMPLETE INTERVIEW TRANSCRIPT:
${formattedTranscript}

Based on the interview and resume, provide a comprehensive evaluation of the candidate in JSON format with the following structure:
{
  "overallScore": [a score from 1-10],
  "strengths": [an array of 3-5 specific strengths demonstrated],
  "areasForImprovement": [an array of 3-5 specific areas for improvement],
  "technicalAssessment": [a paragraph assessing their technical skills],
  "communicationAssessment": [a paragraph assessing their communication skills],
  "jobFitAssessment": [a paragraph assessing their fit for this specific role],
  "recommendedResources": [an array of 2-3 specific resources to help them improve],
  "detailedFeedback": [a comprehensive paragraph with specific feedback]
}

Be honest, fair, and constructive in your evaluation. Focus on specific examples from the interview.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    const evaluation = JSON.parse(jsonMatch[0]);
    return evaluation;
  } catch (error) {
    logger.error("Error generating evaluation:", error);
    // Return a default evaluation in case of error
    return {
      overallScore: 5,
      strengths: [
        "Communication skills",
        "Technical knowledge",
        "Problem-solving approach",
      ],
      areasForImprovement: [
        "Could provide more specific examples",
        "Could elaborate more on technical experiences",
      ],
      technicalAssessment:
        "The candidate demonstrated adequate technical knowledge relevant to the position.",
      communicationAssessment:
        "The candidate communicated clearly throughout the interview.",
      jobFitAssessment:
        "Based on the interview, the candidate appears to have the basic qualifications for the role.",
      recommendedResources: [
        "Relevant online courses",
        "Industry publications",
      ],
      detailedFeedback:
        "The candidate performed adequately in the interview, showing strengths in communication and technical knowledge. With additional preparation and more specific examples, they could improve their interview performance.",
    };
  }
};
