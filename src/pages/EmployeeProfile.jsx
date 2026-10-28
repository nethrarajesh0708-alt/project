import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Alert, Table } from "react-bootstrap";
import { FiUser, FiPhone, FiMail, FiHome, FiBriefcase, FiDollarSign, FiSave, FiCalendar, FiClock, FiActivity, FiShield, FiLock, FiSettings } from "react-icons/fi";
import PageErrorBoundary from "../components/common/ErrorBoundary";
import { api } from "../api";
import AdminSidebar from "../components/Admin/Sidebar";
import { useAuth } from "../context/AuthContext";

// Complete placeholder profile — single source, edit here to change dummy values.
const PROFILE_PLACEHOLDER = {
  id: "EMP0001",
  employeeId: "EMP0001",
  full_name: "John Employee",
  name: "John Employee",
  email: "john.employee@company.com",
  phone: "9876543210",
  photo: "",
  image: "",
  designation: "Software Engineer",
  department: "Engineering",
  department_name: "Engineering",
  join_date: "2018-03-01",
  joining_date: "2018-03-01",
  role: "employee",
  status: "Active",
  permissions: ["Attendance", "Reports", "Settings"],
  roleAssignedBy: "HR Manager",
  roleAssignedOn: "2018-03-01",
  username: "john.employee",
  lastLogin: { time: "2026-10-27 09:15 AM", ip: "192.168.1.105", device: "Chrome on Windows" },
  twoFactorEnabled: false,
  activeSessions: [],
  recentActions: [],
  loginHistory: [],
  preferences: { language: "English", timeZone: "Asia/Kolkata", notifications: true, theme: "light" },
  gender: "Male",
  address: "123 MG Road, Bangalore",
  emergency_name: "Jane Employee",
  emergency_phone: "9876543211",
  emergency_relation: "Spouse",
  date_of_birth: "1985-05-15",
  blood_group: "B+",
  employment_type: "full-time",
  bank_account_details: "****1234",
  pan_number: "ABCDE1234F",
  pf_uan_number: "123456789012",
  assigned_manager_poc: "Rahul Manager",
  qualifications: "B.Tech Computer Science",
  skills: "JavaScript, React",
  photo_url: "",
  manager_id: null,
  leave_balance: 12,
  is_active: 1,
  created_at: "2018-03-01",
  work_location: "Bangalore",
  permanent_address: "123 MG Road, Bangalore",
  dob: "1985-05-15",
};

// Field mapper: API field names -> UI field names. Edit here if backend changes.
const mapProfile = (raw) => ({
  id: raw.id ?? raw.employee_id ?? raw.user_id ?? "",
  employeeId: raw.employeeId ?? raw.employee_id ?? raw.user_id ?? "",
  fullName: raw.full_name ?? raw.name ?? raw.employeeName ?? "",
  name: raw.name ?? raw.full_name ?? raw.employeeName ?? "",
  email: raw.email ?? "",
  phone: raw.phone ?? raw.mobile ?? raw.mobile_number ?? "",
  photo: raw.photo ?? raw.photo_url ?? raw.image ?? "",
  image: raw.image ?? raw.photo ?? raw.photo_url ?? "",
  designation: raw.designation ?? "",
  department: raw.department ?? raw.department_name ?? "",
  department_name: raw.department_name ?? raw.department ?? "",
  joinDate: raw.join_date ?? raw.joining_date ?? raw.created_at ?? "",
  join_date: raw.join_date ?? raw.joining_date ?? raw.created_at ?? "",
  role: raw.role ?? "",
  status: raw.status ?? "",
  permissions: raw.permissions ?? [],
  roleAssignedBy: raw.roleAssignedBy ?? "",
  roleAssignedOn: raw.roleAssignedOn ?? "",
  username: raw.username ?? "",
  lastLogin: raw.lastLogin ?? { time: "-", ip: "-", device: "-" },
  twoFactorEnabled: raw.twoFactorEnabled ?? false,
  activeSessions: raw.activeSessions ?? [],
  recentActions: raw.recentActions ?? [],
  loginHistory: raw.loginHistory ?? [],
  preferences: raw.preferences ?? { language: "English", timeZone: "Asia/Kolkata", notifications: true, theme: "light" },
  gender: raw.gender ?? "",
  address: raw.address ?? "",
  emergency_name: raw.emergency_name ?? "",
  emergency_phone: raw.emergency_phone ?? "",
  emergency_relation: raw.emergency_relation ?? "",
  date_of_birth: raw.date_of_birth ?? "",
  blood_group: raw.blood_group ?? "",
  employment_type: raw.employment_type ?? "",
  bank_account_details: raw.bank_account_details ?? "",
  pan_number: raw.pan_number ?? "",
  pf_uan_number: raw.pf_uan_number ?? "",
  assigned_manager_poc: raw.assigned_manager_poc ?? "",
  qualifications: raw.qualifications ?? "",
  skills: raw.skills ?? "",
  photo_url: raw.photo_url ?? raw.photo ?? raw.image ?? "",
  manager_id: raw.manager_id ?? null,
  leave_balance: raw.leave_balance ?? 0,
  is_active: raw.is_active ?? 1,
  created_at: raw.created_at ?? "",
  work_location: raw.work_location ?? "",
  permanent_address: raw.permanent_address ?? "",
  dob: raw.dob ?? "",
});

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();

  const empId = user?.employee_id || user?.id || user?.employeeId || "EMP0001";

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await api.getProfile(empId);
      setError(err || null);
      if (!err && data) {
        setProfile(mapProfile(data));
      } else {
        setProfile(mapProfile(PROFILE_PLACEHOLDER));
      }
    } catch (e) {
      setError(e.message || "Failed to load profile");
      setProfile(mapProfile(PROFILE_PLACEHOLDER));
    } finally {
      setLoading(false);
    }
  }, [empId]);

  const handleRetry = () => {
    loadProfile();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

// eslint-disable-next-line no-unused-vars
  const handleSave = (e) => {
    e.preventDefault();
    setEditMode(false);
    // TODO: connect function / API - save profile updates
    setSuccess("Profile saved successfully");
  };

  const handleChangePassword = () => {
    // TODO: connect function / API - change password
    setSuccess("Password change requested");
  };

  const handleToggle2FA = () => {
    // TODO: connect function / API - toggle 2FA
    setSuccess("2FA setting updated");
  };

  const handleLogoutAll = () => {
    // TODO: connect function / API - logout all devices
    setSuccess("Logged out of all devices");
  };

  const p = profile || mapProfile(PROFILE_PLACEHOLDER);

  const statusBadge = p.status === "Active" ? "bg-success" : "bg-secondary";
  const roleBadge = p.role === "Admin" ? "bg-primary" : p.role === "HR" ? "bg-info" : p.role === "manager" ? "bg-warning" : "bg-success";

  if (loading) {
    return (
      <PageErrorBoundary>
        <div className="admin-dashboard" style={{ padding: "2rem" }}>
          <AdminSidebar activeTab="profile" setActiveTab={() => {}} />
          <div className="main-content p-4" style={{ marginLeft: "260px" }}>
            <div className="text-center" style={{ padding: "4rem 0" }}>
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading profile...</p>
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary>
      <div className="admin-dashboard" style={{ padding: "2rem" }}>
        <AdminSidebar activeTab="profile" setActiveTab={() => {}} />
        <div className="main-content p-4" style={{ marginLeft: "260px" }}>
          <h2 className="mb-4">My Profile</h2>

          {error && (
            <Alert variant="danger" dismissible>
              <h4>Profile load error</h4>
              <p>{error}</p>
              <Button variant="primary" onClick={handleRetry} className="mt-2">Retry</Button>
            </Alert>
          )}

          {success && <Alert variant="success">{success}</Alert>}

          {/* A) Identity */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0 fw-bold">Identity</Card.Header>
            <Card.Body className="row g-3">
              <div className="col-md-3 text-center">
                {p.photo ? (
                  <img src={p.photo} alt="Profile" className="rounded-circle mb-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ) : (
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}>
                    {p.fullName?.charAt(0)?.toUpperCase() || "J"}
                  </div>
                )}
                <div className="fw-bold">{p.fullName || "-"}</div>
                <div className="text-muted small">{p.email || "-"}</div>
              </div>
              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Employee ID</label>
                    <div className="fw-semibold">{p.employeeId || "-"}</div>
                  </div>
                  <div className={["photo", "name", "phone"].includes("name") ? "col-md-6" : "col-md-6"}>
                    <label className="form-label text-muted small">Full Name</label>
                    {editMode ? (
                      <input type="text" className="form-control form-control-sm" name="fullName" value={formData.fullName || p.fullName || ""} onChange={handleChange} />
                    ) : (
                      <div className="fw-semibold">{p.fullName || "-"}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Email</label>
                    <div className="fw-semibold">{p.email || "-"}</div>
                  </div>
                  <div className={["photo", "name", "phone"].includes("phone") ? "col-md-6" : "col-md-6"}>
                    <label className="form-label text-muted small">Phone</label>
                    {editMode ? (
                      <input type="text" className="form-control form-control-sm" name="phone" value={formData.phone || p.phone || ""} onChange={handleChange} />
                    ) : (
                      <div className="fw-semibold">{p.phone || "-"}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Designation</label>
                    <div className="fw-semibold">{p.designation || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Department</label>
                    <div className="fw-semibold">{p.department || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Join Date</label>
                    <div className="fw-semibold">{p.joinDate ? new Date(p.joinDate).toLocaleDateString() : "-"}</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* B) Role & Access (READ-ONLY) */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0 fw-bold">Role &amp; Access</Card.Header>
            <Card.Body className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small">Role</label>
                <span className={`badge ${roleBadge}`}>{p.role || "-"}</span>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Status</label>
                <span className={`badge ${statusBadge}`}>{p.status || "-"}</span>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Role Assigned By</label>
                <div className="fw-semibold">{p.roleAssignedBy || "-"}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Role Assigned On</label>
                <div className="fw-semibold">{p.roleAssignedOn ? new Date(p.roleAssignedOn).toLocaleDateString() : "-"}</div>
              </div>
              <div className="col-12">
                <label className="form-label text-muted small">Permitted Modules</label>
                <div className="d-flex flex-wrap gap-2">
                  {(p.permissions || []).map((perm, i) => (
                    <span key={i} className="badge bg-light text-dark border">{perm}</span>
                  ))}
                  {(p.permissions || []).length === 0 && <span className="text-muted">-</span>}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* C) Security */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0 fw-bold">Security</Card.Header>
            <Card.Body className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small">Username</label>
                {editMode ? (
                  <input type="text" className="form-control form-control-sm" name="username" value={formData.username || p.username || ""} onChange={handleChange} />
                ) : (
                  <div className="fw-semibold">{p.username || "-"}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Last Login</label>
                <div className="fw-semibold">
                  {p.lastLogin?.time || "-"}
                  <span className="text-muted small">({p.lastLogin?.ip || "-"}, {p.lastLogin?.device || "-"})</span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Password</label>
                <button className="btn btn-outline-primary w-100" onClick={handleChangePassword}>Change password</button>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Two-Factor Authentication</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={editMode ? formData.twoFactorEnabled !== undefined ? formData.twoFactorEnabled : p.twoFactorEnabled : p.twoFactorEnabled}
                    onChange={handleToggle2FA}
                    disabled={!editMode}
                  />
                  <label className="form-check-label">{p.twoFactorEnabled ? "Enabled" : "Disabled"}</label>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Active Sessions</label>
                <div className="fw-semibold">{p.activeSessions?.length || 0}</div>
              </div>
              <div className="col-md-6">
                <button className="btn btn-outline-danger w-100" onClick={handleLogoutAll}>Log out of all devices</button>
              </div>
            </Card.Body>
          </Card>

          {/* D) Activity */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0 fw-bold">Activity</Card.Header>
            <Card.Body>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Recent Actions</label>
                  <Table striped bordered size="sm" className="table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(p.recentActions || []).map((a, i) => (
                        <tr key={i}>
                          <td>{a?.date || "-"}</td>
                          <td>{a?.action || "-"}</td>
                          <td><span className={`badge ${a?.status === "Success" ? "bg-success" : "bg-secondary"}`}>{a?.status || "-"}</span></td>
                        </tr>
                      ))}
                      {(p.recentActions || []).length === 0 && <tr><td colSpan={3} className="text-center text-muted">No records yet</td></tr>}
                    </tbody>
                  </Table>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small">Login History</label>
                  <Table striped bordered size="sm" className="table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(p.loginHistory || []).map((h, i) => (
                        <tr key={i}>
                          <td>{h?.date || "-"}</td>
                          <td>{h?.action || "-"}</td>
                          <td><span className={`badge ${h?.status === "Success" ? "bg-success" : "bg-secondary"}`}>{h?.status || "-"}</span></td>
                        </tr>
                      ))}
                      {(p.loginHistory || []).length === 0 && <tr><td colSpan={3} className="text-center text-muted">No records yet</td></tr>}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* E) Preferences */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 fw-bold">Preferences</Card.Header>
            <Card.Body className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small">Language</label>
                {editMode ? (
                  <select className="form-select form-control-sm" name="preferences.language" value={formData.preferences?.language || p.preferences?.language || "English"} onChange={handleChange}>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                ) : (
                  <div className="fw-semibold">{p.preferences?.language || "-"}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Time Zone</label>
                {editMode ? (
                  <select className="form-select form-control-sm" name="preferences.timeZone" value={formData.preferences?.timeZone || p.preferences?.timeZone || "Asia/Kolkata"} onChange={handleChange}>
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                ) : (
                  <div className="fw-semibold">{p.preferences?.timeZone || "-"}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Notifications</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={editMode ? formData.preferences?.notifications !== undefined ? formData.preferences.notifications : p.preferences?.notifications : p.preferences?.notifications}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                  <label className="form-check-label">{p.preferences?.notifications ? "Enabled" : "Disabled"}</label>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Theme</label>
                {editMode ? (
                  <select className="form-select form-control-sm" name="preferences.theme" value={formData.preferences?.theme || p.preferences?.theme || "light"} onChange={handleChange}>
                    <option>light</option>
                    <option>dark</option>
                  </select>
                ) : (
                  <div className="fw-semibold">{p.preferences?.theme || "-"}</div>
                )}
              </div>
            </Card.Body>
          </Card>

          {!editMode && (
            <div className="mt-3">
              <Button variant="primary" onClick={() => {
                setFormData({
                  fullName: p.fullName || "",
                  phone: p.phone || "",
                  username: p.username || "",
                  preferences: { ...p.preferences },
                  twoFactorEnabled: p.twoFactorEnabled,
                });
                setEditMode(true);
              }}>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default EmployeeProfile;
