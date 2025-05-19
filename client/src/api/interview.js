import api from "../utils/api";
import log from "loglevel";

// Create a new interview
export const startInterview = async (resumeUrl, resumeText, jobDescription) => {
  try {
    const response = await api.post("/interviews", {
      resumeUrl,
      resumeText,
      jobDescription,
    });
    return response.data;
  } catch (error) {
    log.error("Start interview API error:", error);
    throw error.response?.data?.message || "Failed to start interview";
  }
};

// Send a message (answer) during the interview
export const submitAnswer = async (interviewId, answer) => {
  try {
    const response = await api.post(`/interviews/${interviewId}/message`, {
      message: answer,
    });
    return response.data;
  } catch (error) {
    log.error("Submit answer API error:", error);
    throw error.response?.data?.message || "Failed to submit answer";
  }
};

// End the interview and generate feedback
export const endInterview = async (interviewId) => {
  try {
    const response = await api.post(`/interviews/${interviewId}/end`);
    return response.data;
  } catch (error) {
    log.error("End interview API error:", error);
    throw error.response?.data?.message || "Failed to end interview";
  }
};

// Get all interviews of the current user
export const getInterviewHistory = async () => {
  try {
    const response = await api.get("/interviews");
    return response.data;
  } catch (error) {
    log.error("Get history API error:", error);
    throw error.response?.data?.message || "Failed to fetch history";
  }
};

// Get a specific interview
export const getInterview = async (interviewId) => {
  try {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data;
  } catch (error) {
    log.error("Get interview API error:", error);
    throw error.response?.data?.message || "Failed to fetch interview";
  }
};

// Get feedback for an interview
export const getFeedback = async (interviewId) => {
  try {
    const response = await api.get(`/interviews/${interviewId}/feedback`);
    return response.data;
  } catch (error) {
    log.error("Get feedback API error:", error);
    throw error.response?.data?.message || "Failed to fetch feedback";
  }
};
