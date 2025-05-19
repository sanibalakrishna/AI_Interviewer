import api from "../utils/api";
import log from "loglevel";

export const login = async (email, password) => {
  try {
    const response = await api.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    log.error("Login API error:", error);
    throw error.response?.data?.message || "Login failed";
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post("/users/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    log.error("Register API error:", error);
    throw error.response?.data?.message || "Registration failed";
  }
};
