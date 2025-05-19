import { createContext, useState, useEffect } from "react";
import log from "loglevel";
import { login as loginApi, register as registerApi } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assume token is valid; in production, validate with backend
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      log.info("User logged in:", response.user.email);
    } catch (error) {
      log.error("Login failed:", error.message);
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await registerApi(name, email, password);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      log.info("User registered:", response.user.email);
    } catch (error) {
      log.error("Registration failed:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    log.info("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
