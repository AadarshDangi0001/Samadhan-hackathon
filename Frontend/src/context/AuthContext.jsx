import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Backend base URL - adjust if different in production
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ensure axios sends cookies to backend
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = API_BASE;

  // On mount, verify auth by fetching profile from backend
  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      try {
        const res = await axios.get("/api/auth/profile");
        if (mounted && res?.data?.user) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    verify();

    return () => {
      mounted = false;
    };
  }, []);

  // login/logout helpers for UI only — backend manages cookie
  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
