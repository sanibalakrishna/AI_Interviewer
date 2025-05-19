import { createContext, useState } from "react";
import log from "loglevel";
import {
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterview, // <- You'll need this to fetch transcript
  getFeedback,
} from "../api/interview";
import { uploadResume } from "../api/upload";

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [interview, setInterview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const uploadResumeOnly = async (resume) => {
    setLoading(true);
    try {
      const resumeData = await uploadResume(resume);
      return {
        resumeUrl: resumeData.data.url,
        resumeText: resumeData.data.resumeText,
      };
    } catch (err) {
      log.error("File upload failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const start = async ({ resumeUrl, resumeText, jobDescription }) => {
    setLoading(true);
    try {
      const response = await startInterview(
        resumeUrl,
        resumeText,
        jobDescription
      );
      setInterview(response.data);
      log.info("Interview started:", response.data._id);
      return { ...response.data };
    } catch (err) {
      log.error("Start interview failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (interviewId, answer) => {
    setSending(true);
    try {
      const response = await submitAnswer(interviewId, answer);
      setInterview(response.data.interview);
      const transcript = response.data.interview.transcript || [];
      const mapped = transcript.map((entry) => ({
        sender: entry.role === "candidate" ? "user" : "ai",
        text: entry.content,
      }));
      setMessages(mapped);
      // refresh after sending
      log.info("Answer submitted for interview:", interviewId);
    } catch (err) {
      log.error("Answer submission failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  };

  const end = async (interviewId) => {
    setLoading(true);
    try {
      const response = await endInterview(interviewId);
      setInterview(null);
      log.info("Interview ended:", interviewId);
      return response.feedback;
    } catch (err) {
      log.error("End interview failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getInterviewHistory();
      setHistory(response.data);
      log.info("Interview history fetched");
    } catch (err) {
      log.error("Fetch history failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (interviewId) => {
    setLoadingMessages(true);
    try {
      const res = await getInterview(interviewId); // fetch interview details
      const transcript = res.data.transcript || [];
      const mapped = transcript.map((entry) => ({
        sender: entry.role === "candidate" ? "user" : "ai",
        text: entry.content,
      }));
      setMessages(mapped);
      log.info("Transcript loaded for interview:", interviewId);
    } catch (err) {
      log.error("Fetching transcript failed:", err.message);
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };
  const fetchFeedback = async (interviewId) => {
    setLoading(true);
    try {
      const feedback = await getFeedback(interviewId);
      const feedbackData = feedback.data;
      setFeedback(feedbackData);
      log.info("Feedback fetched for interview:", interviewId);
    } catch (err) {
      log.error("Fetching feedback failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        interview,
        history,
        loading,
        error,
        messages,
        loadingMessages,
        sending,
        uploadResumeOnly,
        start,
        sendMessage,
        end,
        fetchHistory,
        fetchMessages,
        fetchFeedback,
        feedback,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
