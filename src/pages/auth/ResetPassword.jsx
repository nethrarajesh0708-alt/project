import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setApiError("Invalid or expired reset link");
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = "Must contain uppercase letter";
    else if (!/[a-z]/.test(formData.password))
      newErrors.password = "Must contain lowercase letter";
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = "Must contain a number";
    else if (!/[^A-Za-z0-9]/.test(formData.password))
      newErrors.password = "Must contain a special character";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    return newErrors;
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
      const response = await fetch(
        `${BASE_URL}backend/api/auth/website_reset_password.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, token }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setApiError(data.message || "Failed to reset password");
        }
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card text-center">
            <FiCheckCircle className="success-icon" />
            <h1>Password Reset!</h1>
            <p>Your password has been reset successfully.</p>
            <p className="text-muted">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-box">
              <div className="box-header">
                <FiLock className="box-icon" />
                <h3>New Password</h3>
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter new password"
                      className={errors.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
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
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirm_password: e.target.value,
                        }))
                      }
                      placeholder="Confirm new password"
                      className={errors.confirm_password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <span className="error-text">
                      <FiAlertCircle />{" "}
                      {errors.confirm_password}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
