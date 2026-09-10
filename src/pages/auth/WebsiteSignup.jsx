import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import "./auth.css";

const WebsiteSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    emp_id: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [empIdStatus, setEmpIdStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [success, setSuccess] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("website_user")) {
      navigate("/website/dashboard");
    }
  }, [navigate]);

  const checkEmpId = async (empId) => {
    if (empId.length < 3) {
      setEmpIdStatus(null);
      return;
    }
    try {
      const res = await fetch(
        `${BASE_URL}backend/api/auth/website_check_username.php?emp_id=${encodeURIComponent(empId)}`
      );
      const data = await res.json();
      setEmpIdStatus(data.available ? "available" : "taken");
    } catch {
      setEmpIdStatus(null);
    }
  };

  const checkEmail = async (email) => {
    if (!/^\S+@\S+\.\S+/.test(email)) {
      setEmailStatus(null);
      return;
    }
    try {
      const res = await fetch(
        `${BASE_URL}backend/api/auth/website_check_email.php?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setEmailStatus(data.available ? "available" : "taken");
    } catch {
      setEmailStatus(null);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");

    if (name === "emp_id") checkEmpId(val);
    if (name === "email") checkEmail(val);
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(val));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.emp_id.trim())
      newErrors.emp_id = "Emp ID is required";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.emp_id))
      newErrors.emp_id =
        "Emp ID must be 3-20 characters (letters, numbers, underscores)";
    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[+]?[\d\s()-]{10,15}$/.test(formData.phone))
      newErrors.phone = "Phone number is invalid";
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
    if (!formData.terms)
      newErrors.terms = "You must agree to the Terms";
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
         `${BASE_URL}backend/api/auth/website_employee_register.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/LoginFetch"), 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setApiError(data.message || "Registration failed");
        }
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "#ef4444";
    if (passwordStrength <= 3) return "#d97706";
    return "#16a34a";
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us today</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Box 1 - Personal Details */}
            <div className="auth-box">
              <div className="box-header">
                <FiUser className="box-icon" />
                <h3>Personal Details</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={errors.full_name ? "error" : ""}
                    />
                  </div>
                  {errors.full_name && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.full_name}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Emp ID</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                     <input
                       type="text"
                       name="emp_id"
                       value={formData.emp_id}
                       onChange={handleChange}
                       placeholder="Choose an Emp ID"
                       className={errors.emp_id ? "error" : ""}
                     />
                     {empIdStatus && (
                       <span className={`status-icon ${empIdStatus}`}>
                         {empIdStatus === "available" ? (
                           <FiCheckCircle />
                         ) : (
                           <FiXCircle />
                         )}
                       </span>
                     )}
                  </div>
                   {errors.emp_id && (
                     <span className="error-text">
                       <FiAlertCircle /> {errors.emp_id}
                     </span>
                   )}
                   {empIdStatus === "available" && !errors.emp_id && (
                     <span className="success-text">
                       <FiCheckCircle /> Emp ID available
                     </span>
                   )}
                </div>
              </div>
            </div>

            {/* Box 2 - Contact Details */}
            <div className="auth-box">
              <div className="box-header">
                <FiMail className="box-icon" />
                <h3>Contact Details</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.email ? "error" : ""}
                    />
                    {emailStatus && (
                      <span className={`status-icon ${emailStatus}`}>
                        {emailStatus === "available" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiXCircle />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.email && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.email}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={errors.phone ? "error" : ""}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-text">
                      <FiAlertCircle /> {errors.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Box 3 - Password & Security */}
            <div className="auth-box">
              <div className="box-header">
                <FiLock className="box-icon" />
                <h3>Password & Security</h3>
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
                      placeholder="Create a password"
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
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${(passwordStrength / 5) * 100}%`,
                            background: getStrengthColor(),
                          }}
                        />
                      </div>
                      <span
                        className="strength-label"
                        style={{ color: getStrengthColor() }}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                  )}
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
                      onChange={handleChange}
                      placeholder="Confirm your password"
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
                      <FiAlertCircle /> {errors.confirm_password}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Box 4 - Terms & Consent */}
            <div className="auth-box terms-box">
              <div className="box-content">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  I agree to the{" "}
                  <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
                {errors.terms && (
                  <span className="error-text">
                    <FiAlertCircle /> {errors.terms}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading || success}
            >
              {success ? "Account Created!" : isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {!success && (
            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteSignup;
