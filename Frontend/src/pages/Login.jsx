import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import bike from "../assets/bike.png";
import LoginLogo from "../assets/LoginLogo.png";
import googleLogo from "../assets/Google__G__logo.webp";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { updateUser } = useUser();

  // If already logged in → go to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // POST to backend; backend sets an httpOnly cookie token
      const response = await axios.post(
        "/api/auth/login",
        formData,
        { withCredentials: true }
      );

      // backend returns { message, user }
      if (response.data?.user) {
        login();
        updateUser({
          name: `${response.data.user.fullName?.firstName || ""} ${response.data.user.fullName?.lastName || ""}`.trim(),
          email: response.data.user.email,
          profilePic: response.data.user.profilePic,
        });
        navigate("/");
      } else {
        setError(response.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src={LoginLogo} alt="Login Logo" className="login-logo" />
          <img src={bike} alt="Bike" className="login-bike" />
        </div>

        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Login to access your TravelWise account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login-input-box">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* Password */}
          <div className="login-input-box login-password-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <span
              className="login-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </span>
          </div>

          {/* Remember Me */}
          <div className="login-check">
            <input type="checkbox" />
            <label>Remember me</label>
            <p className="login-forget">Forgot Password</p>
          </div>

          {/* Error message */}
          {error && <p className="login-error">{error}</p>}

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup link */}
          <p className="login-signup-link">
            Don’t have an account? <NavLink to="/signup">Sign Up</NavLink>
          </p>

          {/* Divider */}
          <div className="login-with">
            <div className="line"></div>
            <p>Or login with</p>
            <div className="line"></div>
          </div>

          {/* Google login placeholder */}
          <div className="login-google">
            <img src={googleLogo} alt="Google" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
