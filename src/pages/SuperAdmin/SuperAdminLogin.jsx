import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import "./SuperAdmin.css";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("super_admin")) {
      navigate("/super-admin/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id.trim()) {
      newErrors.user_id = "Super Admin ID is required";
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
      const response = await fetch(`${BASE_URL}backend/api/super_admin/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("super_admin", JSON.stringify(data.user));
        navigate("/super-admin/dashboard");
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
    <div className="super-admin-page">
      <div className="super-admin-container">
        <div className="super-admin-card">
          <div className="super-admin-header">
            <h1>Super Admin Login</h1>
            <p>Access the system control panel</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="super-admin-box">
              <div className="box-header">
                <FiLock className="box-icon" />
                <h3>Credentials</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Super Admin ID</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type="text"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      placeholder="Enter Super Admin ID"
                      className={errors.user_id ? "error" : ""}
                    />
                  </div>
                  {errors.user_id && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.user_id}
                    </span>
                  )}
                </div>
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
              </div>
            </div>

            <button
              type="submit"
              className="super-admin-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
