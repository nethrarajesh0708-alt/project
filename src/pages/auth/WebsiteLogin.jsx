import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWebsiteAuth } from "../../context/WebsiteAuthContext";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import "./auth.css";

const WebsiteLogin = () => {
  const navigate = useNavigate();
  const { login } = useWebsiteAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("website_user")) {
      navigate("/EmployeeDashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or Employee ID is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
        const response = await fetch(`${BASE_URL}backend/api/auth/website_login.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.identifier, password: formData.password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user);
        navigate("/EmployeeDashboard");
      } else {
        setApiError(data.message);
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Box */}
            <div className="auth-box">
              <div className="box-header">
                <FiUser className="box-icon" />
                <h3>Account</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Email or Employee ID</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your email or Employee ID"
                      className={errors.identifier ? "error" : ""}
                    />
                  </div>
                  {errors.identifier && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.identifier}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Password Box */}
            <div className="auth-box">
              <div className="box-header">
                <FiLock className="box-icon" />
                <h3>Password</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={errors.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.password}
                    </span>
                  )}
                </div>
                <div className="forgot-link">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteLogin;
