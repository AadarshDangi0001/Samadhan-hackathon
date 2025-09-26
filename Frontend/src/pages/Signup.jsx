// src/pages/Signup.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";
import signupCha from "../assets/singupCha.png";
import LoginLogo from "../assets/LoginLogo.png";
import googleLogo from "../assets/Google__G__logo.webp";
import { toast, ToastContainer } from "react-toastify";
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the Terms and Privacy Policies");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Prepare payload to match backend: fullName object
      const payload = {
        fullName: { firstName: formData.firstName, lastName: formData.lastName },
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "/api/auth/register",
        payload,
        { withCredentials: true }
      );

      if (response.data?.user) {
          toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 1000);

      } else {
        setError(response.data?.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <img src={signupCha} alt="Signup Character" className="signup-cha" />
        <img src={LoginLogo} alt="Logo" className="signup-logo" />

        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>
          <p>
            Let’s get you all set up so you can access your personal account.
          </p>

          <div className="signup-name-row">
            <div className="signup-input-box">
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="signup-input-box">
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          <div className="signup-input-box">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="signup-input-box signup-password-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <span
              className="signup-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </span>
          </div>

          <div className="signup-input-box signup-password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <span
              className="signup-toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </span>
          </div>

          <div className="signup-checkbox">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            <label htmlFor="termsAccepted">
              I agree to the <span>Terms</span> and <span>Privacy Policies</span>
            </label>
          </div>

<div className="error">
            {error && <p className="signup-error">{error}</p>}

</div>
          <button className="btn-sign" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="signup-login-link">
            <p>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </p>
          </div>

          <div className="signup-with">
            <div className="line"></div>
            <span>Or signup with</span>
            <div className="line"></div>
          </div>
          <div className="signup-google">
            <img src={googleLogo} alt="Google" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
