import api from "../utils/api";
import log from "loglevel";

// Upload resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await api.post("/uploads/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    log.error("Upload resume API error:", error);
    throw error.response?.data?.message || "Failed to upload resume";
  }
};
