import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Alert, Table } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import PageErrorBoundary from "../../components/common/ErrorBoundary";
import { api } from "../../api";
import "../../assets/css/AdminDashboard.css";

// Admin profile field mapper: API field names -> UI field names. Edit here if backend changes.
const mapProfile = (raw) => ({
  id: raw.id ?? raw.employee_id ?? raw.user_id ?? "",
  name: raw.name ?? raw.full_name ?? raw.employeeName ?? "",
  email: raw.email ?? "",
  phone: raw.phone ?? raw.mobile ?? raw.mobile_number ?? "",
  designation: raw.designation ?? "",
  department: raw.department ?? raw.department_name ?? "",
  joinDate: raw.join_date ?? raw.joining_date ?? raw.created_at ?? "",
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
  photo: raw.photo ?? raw.photo_url ?? raw.image ?? "",
});

const ADMIN_PLACEHOLDER = {
  id: "temp-admin",
  name: "John Admin",
  email: "john.admin@company.com",
  role: "Admin",
  employee_id: "ADMIN001",
  full_name: "John Admin",
  user_id: "ADMIN001",
  designation: "System Administrator",
  department: "Engineering",
  joinDate: "2018-03-01",
  status: "Active",
  permissions: ["Employees", "Attendance", "Payroll", "Reports", "Settings"],
  roleAssignedBy: "System",
  roleAssignedOn: "2018-03-01",
  username: "john.admin",
  lastLogin: { time: "2026-10-27 09:15 AM", ip: "192.168.1.105", device: "Chrome on Windows" },
  twoFactorEnabled: false,
  activeSessions: [],
  recentActions: [],
  loginHistory: [],
  preferences: { language: "English", timeZone: "Asia/Kolkata", notifications: true, theme: "light" },
  photo: "",
  phone: "9876543210",
  image: "",
  gender: "Male",
  address: "123 MG Road, Bangalore",
  emergency_contact: "9876543211",
  qualifications: "B.Tech Computer Science",
  skills: "Java, Spring Boot",
  photo_url: "",
  manager_id: null,
  leave_balance: 20,
  is_active: 1,
  created_at: "2018-03-01",
  work_location: "Bangalore",
  permanent_address: "123 MG Road, Bangalore",
  dob: "1985-05-15",
  bank_account_details: "Not provided",
  pan_number: "Not provided",
  pf_uan_number: "Not provided",
  employment_type: "full-time",
  assigned_manager_poc: "Not assigned",
  blood_group: "",
  date_of_birth: "1985-05-15",
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const empId = user?.employee_id || user?.id || "";
    if (!empId) {
      // Fall back to placeholder user
      setProfile(mapProfile(ADMIN_PLACEHOLDER));
      setLoading(false);
      return;
    }
    api.getEmployee(empId)
      .then(({ data, error: err }) => {
        setError(err || null);
        if (!err && data) {
          setProfile(mapProfile(data));
        } else {
          setProfile(mapProfile(ADMIN_PLACEHOLDER));
        }
      })
      .catch(() => {
        setProfile(mapProfile(ADMIN_PLACEHOLDER));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.employee_id, user?.id]);

  const p = profile || mapProfile(ADMIN_PLACEHOLDER);

  const editableFields = ["photo", "name", "phone", "preferences"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: connect function / API - save profile updates
    setEditing(false);
  };

  const handleToggle2FA = () => {
    // TODO: connect function / API - toggle 2FA
    setEditing(false);
  };

  const handleLogoutAll = () => {
    // TODO: connect function / API - logout all devices
    alert("Logged out of all devices (mock - no backend)");
  };

  const handleChangePassword = () => {
    // TODO: connect function / API - change password
    alert("Change password (mock - no backend)");
  };

  if (loading) {
    return (
      <PageErrorBoundary>
        <div className="admin-dashboard">
          <div className="text-center" style={{ padding: "4rem 0" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading profile...</p>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  if (error && !profile) {
    return (
      <PageErrorBoundary>
        <div className="admin-dashboard">
          <div className="text-center" style={{ padding: "4rem 0" }}>
            <div className="alert alert-danger" style={{ maxWidth: "500px", margin: "0 auto" }}>
              <h4>Could not load profile</h4>
              <p>{error}</p>
              <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  const statusBadge = p.status === "Active" ? "bg-success" : "bg-secondary";
  const roleBadge = p.role === "Admin" ? "bg-primary" : "bg-info";

  return (
    <PageErrorBoundary>
      <div className="admin-dashboard" style={{ padding: "2rem" }}>
        <h2 className="mb-4">My Profile</h2>

        {/* A) Identity */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-white border-0 fw-bold">Identity</Card.Header>
          <Card.Body className="row g-3">
            <div className="col-md-3 text-center">
              {p.photo ? (
                <img src={p.photo} alt="Profile" className="rounded-circle mb-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              ) : (
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}>
                  {p.name?.charAt(0)?.toUpperCase() || "J"}
                </div>
              )}
              <div className="fw-bold">{p.name || "-"}</div>
              <div className="text-muted small">{p.email || "-"}</div>
            </div>
            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Employee ID</label>
                  <div className="fw-semibold">{p.employee_id || "-"}</div>
                </div>
                <div className={editableFields.includes("name") ? "col-md-6" : "col-md-6"}>
                  <label className="form-label text-muted small">Full Name</label>
                  {editing ? (
                    <input type="text" className="form-control form-control-sm" name="name" value={form.name || p.name || ""} onChange={handleChange} />
                  ) : (
                    <div className="fw-semibold">{p.name || "-"}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small">Email</label>
                  <div className="fw-semibold">{p.email || "-"}</div>
                </div>
                <div className={editableFields.includes("phone") ? "col-md-6" : "col-md-6"}>
                  <label className="form-label text-muted small">Phone</label>
                  {editing ? (
                    <input type="text" className="form-control form-control-sm" name="phone" value={form.phone || p.phone || ""} onChange={handleChange} />
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
              {editing ? (
                <input type="text" className="form-control form-control-sm" name="username" value={form.username || p.username || ""} onChange={handleChange} />
              ) : (
                <div className="fw-semibold">{p.username || "-"}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small">Last Login</label>
              <div className="fw-semibold">
                {p.lastLogin?.time || "-"} <span className="text-muted small">({p.lastLogin?.ip || "-"}, {p.lastLogin?.device || "-"})</span>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small">Password</label>
              <button className="btn btn-outline-primary w-100" onClick={handleChangePassword}>Change password</button>
            </div>
            <div className={editableFields.includes("preferences") ? "col-md-6" : "col-md-6"}>
              <label className="form-label text-muted small">Two-Factor Authentication</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editing ? form.twoFactorEnabled !== undefined ? form.twoFactorEnabled : p.twoFactorEnabled : p.twoFactorEnabled}
                  onChange={handleToggle2FA}
                  disabled={!editing}
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
                    {(p.recentActions || []).length === 0 && <tr><td colSpan={3} className="text-center text-muted">-</td></tr>}
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
                    {(p.loginHistory || []).length === 0 && <tr><td colSpan={3} className="text-center text-muted">-</td></tr>}
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
              {editing ? (
                <select className="form-select form-control-sm" name="preferences.language" value={form.preferences?.language || p.preferences?.language || "English"} onChange={handleChange}>
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
              {editing ? (
                <select className="form-select form-control-sm" name="preferences.timeZone" value={form.preferences?.timeZone || p.preferences?.timeZone || "Asia/Kolkata"} onChange={handleChange}>
                  <option>Asia/Kolkata</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              ) : (
                <div className="fw-semibold">{p.preferences?.timeZone || "-"}</div>
              )}
            </div>
            <div className={editableFields.includes("preferences") ? "col-md-6" : "col-md-6"}>
              <label className="form-label text-muted small">Notifications</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editing ? form.preferences?.notifications !== undefined ? form.preferences.notifications : p.preferences?.notifications : p.preferences?.notifications}
                  onChange={handleChange}
                  disabled={!editing}
                />
                <label className="form-check-label">{p.preferences?.notifications ? "Enabled" : "Disabled"}</label>
              </div>
            </div>
            <div className={editableFields.includes("preferences") ? "col-md-6" : "col-md-6"}>
              <label className="form-label text-muted small">Theme</label>
              {editing ? (
                <select className="form-select form-control-sm" name="preferences.theme" value={form.preferences?.theme || p.preferences?.theme || "light"} onChange={handleChange}>
                  <option>light</option>
                  <option>dark</option>
                </select>
              ) : (
                <div className="fw-semibold">{p.preferences?.theme || "-"}</div>
              )}
            </div>
          </Card.Body>
        </Card>

        {!editing && (
          <div className="mt-3">
            <Button variant="primary" onClick={() => {
              setForm({
                name: p.name || "",
                phone: p.phone || "",
                username: p.username || "",
                preferences: { ...p.preferences },
                twoFactorEnabled: p.twoFactorEnabled,
              });
              setEditing(true);
            }}>Edit Profile</Button>
          </div>
        )}
      </div>
    </PageErrorBoundary>
  );
};

export default AdminProfile;
