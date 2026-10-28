import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogIn, FiUser, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const LOGIN_ENDPOINT = `${API_BASE_URL}/backend/api/auth/login.php`;

const HrLogin = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // If already logged in as HR, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'hr') {
        navigate('/hr/dashboard', { replace: true });
      } else {
        setAccessDenied(true);
      }
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { identifier: '', password: '' },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Email or Employee ID is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      setAccessDenied(false);

      try {
        let backendUnavailable = false;
        let response = null;

        try {
          response = await fetch(LOGIN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username: values.identifier.trim(), password: values.password }),
          });
        } catch {
          backendUnavailable = true;
        }

        if (response) {
          const ct = response.headers.get('content-type') || '';
          if (!ct.includes('application/json')) backendUnavailable = true;
        }

        // Dev mock: identifier "hr" bypasses backend
        if (backendUnavailable && values.identifier.trim().toLowerCase() === 'hr') {
          await login({ username: 'hr', role: 'hr', mock: true });
          navigate('/hr/dashboard', { replace: true });
          return;
        }

        if (!response || backendUnavailable) {
          setError('Login service is unavailable. Please try again.');
          return;
        }

        let data = null;
        try { data = await response.json(); } catch { /* empty */ }

        if (!data) { setError('Login service is unavailable. Please try again.'); return; }
        if (!response.ok) { setError(data.message || 'Invalid credentials'); return; }

        if (data.success) {
          const role = data.role || data.user?.role;
          if (role !== 'hr') {
            setAccessDenied(true);
            return;
          }
          const userData = data.user && typeof data.user === 'object' && !Array.isArray(data.user)
            ? { ...data.user, role }
            : { username: values.identifier.trim(), role };
          await login(userData);
          navigate('/hr/dashboard', { replace: true });
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (accessDenied) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <Card className="shadow-sm border-0 text-center p-4" style={{ maxWidth: 400, width: '100%' }}>
          <div className="mb-3" style={{ fontSize: '3rem' }}>🚫</div>
          <h4 className="fw-bold text-danger">Access Denied</h4>
          <p className="text-muted">This portal is restricted to HR personnel only.</p>
          <Button variant="outline-primary" onClick={() => navigate('/LoginFetch')}>
            Go to Main Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#f1f5f9' }}>
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: 420 }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: 60, height: 60, background: 'rgba(22,58,122,0.1)' }}
            >
              <FiLogIn size={28} style={{ color: '#163A7A' }} />
            </div>
            <h3 className="fw-bold mb-1">HR Portal</h3>
            <p className="text-muted small">Sign in with your HR credentials</p>
          </div>

          {error && (
            <Alert variant="danger" className="d-flex align-items-center py-2">
              <FiAlertCircle className="me-2 flex-shrink-0" size={16} />
              <span className="small">{error}</span>
            </Alert>
          )}

          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="text-muted small fw-bold">EMAIL / EMPLOYEE ID</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiUser className="text-muted" />
                </span>
                <Form.Control
                  type="text"
                  name="identifier"
                  placeholder="Enter email or employee ID"
                  value={formik.values.identifier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.identifier && !!formik.errors.identifier}
                  className="border-start-0"
                />
                <Form.Control.Feedback type="invalid">
                  <FiAlertCircle size={13} className="me-1" />
                  {formik.errors.identifier}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-muted small fw-bold">PASSWORD</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiLock className="text-muted" />
                </span>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                  className="border-start-0 border-end-0"
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FiEyeOff className="text-muted" /> : <FiEye className="text-muted" />}
                </button>
                <Form.Control.Feedback type="invalid">
                  <FiAlertCircle size={13} className="me-1" />
                  {formik.errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 fw-bold"
              disabled={isLoading}
              style={{ background: '#163A7A', border: 'none' }}
            >
              {isLoading ? (
                <><Spinner as="span" animation="border" size="sm" className="me-2" />Signing in...</>
              ) : (
                <><FiLogIn className="me-2" />Sign In to HR Portal</>
              )}
            </Button>
          </Form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Dev access key: <strong>hr</strong> (any password)
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HrLogin;
