import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import "./auth.css";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const username = location.state?.username || "";
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}backend/api/auth/website_verify_email.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: verificationCode.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Email verified successfully!");
        setIsVerified(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${BASE_URL}backend/api/auth/website_resend_verification.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Verification code sent!");
        setResendCooldown(60);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  if (isVerified) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card text-center">
            <FiCheckCircle className="success-icon" />
            <h1>Email Verified!</h1>
            <p>Your account has been verified successfully.</p>
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
            <h1>Verify Your Email</h1>
            <p>
              We sent a verification code to <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <form onSubmit={handleVerify}>
            <div className="auth-box">
              <div className="box-header">
                <FiMail className="box-icon" />
                <h3>Verification</h3>
              </div>
              <div className="box-content">
                <div className="form-group">
                  <label>Verification Code</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter verification code"
                      className={error ? "error" : ""}
                    />
                  </div>
                  {error && (
                    <span className="error-text">
                      <FiAlertCircle /> {error}
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
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Didn't receive the code?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend"}
              </button>
            </p>
            <p className="mt-2">
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
