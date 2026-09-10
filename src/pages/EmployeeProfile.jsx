import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Nav,
  Tab,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiUser, FiPhone, FiMail, FiHome, FiBriefcase, FiDollarSign, FiSave, FiCalendar, FiClock, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WorkRecord from "./Tasks/Employee/WorkRecord";
import DefaultAvatar from "../components/Employee/DefaultAvatar";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState({ present_days: 0, late_days: 0, leave_balance: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    emergency_name: "",
    emergency_phone: "",
    emergency_relation: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    employment_type: "",
    designation: "",
    bank_account_details: "",
    pan_number: "",
    pf_uan_number: "",
  });

  const [leaveForm, setLeaveForm] = useState({
    leave_year: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    leave_days: 0,
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [leaveError, setLeaveError] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchWidgets();
    fetchRecentSessions();
  }, []);

  useEffect(() => {
    if (leaveForm.start_date && leaveForm.end_date) {
      const start = new Date(leaveForm.start_date);
      const end = new Date(leaveForm.end_date);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setLeaveForm((prev) => ({ ...prev, leave_days: diffDays }));
      } else {
        setLeaveForm((prev) => ({ ...prev, leave_days: 0 }));
      }
    } else {
      setLeaveForm((prev) => ({ ...prev, leave_days: 0 }));
    }
  }, [leaveForm.start_date, leaveForm.end_date]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/profile/profile.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const profile = data.profile;
        setProfile(profile);
        setFormData({
          phone: profile.phone || "",
          email: profile.email || "",
          address: profile.address || "",
          emergency_name: profile.emergency_name || "",
          emergency_phone: profile.emergency_phone || "",
          emergency_relation: profile.emergency_relation || "",
          date_of_birth: profile.date_of_birth && profile.date_of_birth !== "0000-00-00" ? profile.date_of_birth : "",
          gender: profile.gender || "",
          blood_group: profile.blood_group || "",
          employment_type: profile.employment_type || "full-time",
          designation: profile.designation || "",
          bank_account_details: profile.bank_account_details || "",
          pan_number: profile.pan_number || "",
          pf_uan_number: profile.pf_uan_number || "",
        });
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchWidgets = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/profile/widgets.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setWidgets(data.widgets);
      }
    } catch (err) {
      console.error("Failed to load widgets", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDuration = (minutes) => {
    const safe = Math.max(0, minutes || 0);
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    return `${h}h ${m}m`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const formatSessionTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const fetchRecentSessions = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=history&limit=10`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRecentSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to fetch recent sessions", err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BASE_URL}backend/api/profile/profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setEditMode(false);
        fetchProfile();
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const getWorkingYears = () => {
    if (!profile?.join_date) return [new Date().getFullYear()];
    const joinYear = new Date(profile.join_date).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = joinYear; y <= currentYear; y++) {
      years.push(y);
    }
    return years;
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    setLeaveError("");
    setLeaveSuccess("");

    const leaveTypeMap = {
      "Leave": 1,
      "Permission": 7
    };

    try {
      const res = await fetch(`${BASE_URL}backend/api/leave/leave_requests.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          employee_id: profile.id,
          leave_type_id: leaveTypeMap[leaveForm.leave_type] || 1,
          start_date: leaveForm.start_date,
          end_date: leaveForm.end_date,
          reason: leaveForm.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeaveSuccess(data.message || "Leave request submitted successfully");
        setLeaveForm({
          leave_year: "",
          leave_type: "",
          start_date: "",
          end_date: "",
          reason: "",
          leave_days: 0,
        });
      } else {
        setLeaveError(data.message || "Failed to submit leave request");
      }
    } catch {
      setLeaveError("Something went wrong");
    } finally {
      setLeaveSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
              <div
                className="d-flex align-items-center mb-4"
              >
                <motion.div
                  className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                  style={{ width: "80px", height: "80px" }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                >
                  {profile.image ? (
                    <img
                      src={`${BASE_URL}backend/assets/uploads/employee/${profile.image}`}
                      alt="Profile"
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <DefaultAvatar name={profile.full_name} gender={profile.gender} status={profile.status} size={80} />
                  )}
                </motion.div>
                <div className="flex-grow-1">
                  <motion.h3
                    className="mb-0 fw-bold"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
                  >
                    {profile.full_name}
                  </motion.h3>
                  <motion.p
                    className="text-muted mb-0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.18 }}
                  >
                    {profile.designation || "Employee"}
                  </motion.p>
                  <motion.span
                    className="badge bg-primary mt-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.24 }}
                  >
                    {profile.user_id}
                  </motion.span>
                </div>
                {!editMode && (
                  <>
                    <Button variant="outline-primary" onClick={() => setEditMode(true)} className="me-2">
                      Edit Profile
                    </Button>
                    <Button variant="primary" onClick={() => navigate("/salary-slip")}>
                      View Salary Slip
                    </Button>
                  </>
                )}
              </div>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                <FiCalendar className="text-success" size={24} />
              </div>
              <div>
                <p className="text-muted mb-0 small">Attendance This Month</p>
                <h4 className="mb-0 fw-bold">{widgets.present_days} days</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                <FiClock className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-muted mb-0 small">Late Days</p>
                <h4 className="mb-0 fw-bold">{widgets.late_days} days</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                <FiBriefcase className="text-info" size={24} />
              </div>
              <div>
                <p className="text-muted mb-0 small">Leave Balance</p>
                <h4 className="mb-0 fw-bold">{widgets.leave_balance} days</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="basic">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4 p-md-5">
            <Nav variant="tabs" className="mb-4 profile-tabs">
              <Nav.Item>
                <Nav.Link eventKey="basic"><FiUser className="me-2" />Basic Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activity"><FiActivity className="me-2" />Activity</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="leave"><FiCalendar className="me-2" />Leave Apply</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="payroll"><FiDollarSign className="me-2" />Payroll</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="personal"><FiMail className="me-2" />Personal Info</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="basic" className="pt-3">
                <h5 className="fw-bold mb-4">Basic Information</h5>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" value={profile.full_name} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Employee ID</Form.Label>
                      <Form.Control type="text" value={profile.user_id} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        value={profile.join_date || ""}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Assigned Manager / POC</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.assigned_manager_poc || "Not assigned"}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Designation</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.designation || "Not set"}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.department_name || "Not assigned"}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Employment Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={profile.employment_type || "Not set"}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Profile Photo</Form.Label>
                      <Form.Control type="text" value={profile.image || "No photo uploaded"} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="activity" className="pt-3">
                <h5 className="fw-bold mb-4">Recent Sessions</h5>
                {recentSessions.length === 0 ? (
                  <p className="text-muted mb-0">No sessions recorded yet.</p>
                ) : (
                  <Table striped bordered hover responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Total Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessions.map((session) => (
                        <tr key={session.id}>
                          <td>{formatDate(session.session_date || session.start_time)}</td>
                          <td>{formatSessionTime(session.start_time)}</td>
                          <td>{formatSessionTime(session.end_time)}</td>
                          <td>{formatDuration(session.duration_minutes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <h5 className="fw-bold mb-4 mt-5">Work Record</h5>
                <WorkRecord />
              </Tab.Pane>

              <Tab.Pane eventKey="leave" className="pt-3">
                <h5 className="fw-bold mb-4">Leave Apply</h5>
                {leaveSuccess && <Alert variant="success">{leaveSuccess}</Alert>}
                {leaveError && <Alert variant="danger">{leaveError}</Alert>}
                <Form onSubmit={handleLeaveSubmit}>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Year of Working</Form.Label>
                        <Form.Select
                          name="leave_year"
                          value={leaveForm.leave_year}
                          onChange={(e) => setLeaveForm({ ...leaveForm, leave_year: e.target.value })}
                          required
                        >
                          <option value="">Select Year</option>
                          {getWorkingYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Type of Leave</Form.Label>
                        <Form.Select
                          name="leave_type"
                          value={leaveForm.leave_type}
                          onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Leave">Leave</option>
                          <option value="Permission">Permission</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Start Date</Form.Label>
                        <DatePicker
                          selected={leaveForm.start_date ? new Date(leaveForm.start_date) : null}
                          onChange={(date) => {
                            const formatted = date ? date.toISOString().split('T')[0] : "";
                            setLeaveForm({ ...leaveForm, start_date: formatted });
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="YYYY-MM-DD"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>End Date</Form.Label>
                        <DatePicker
                          selected={leaveForm.end_date ? new Date(leaveForm.end_date) : null}
                          onChange={(date) => {
                            const formatted = date ? date.toISOString().split('T')[0] : "";
                            setLeaveForm({ ...leaveForm, end_date: formatted });
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="YYYY-MM-DD"
                          minDate={leaveForm.start_date ? new Date(leaveForm.start_date) : undefined}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Number of Days</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          value={leaveForm.leave_days || ''}
                          placeholder="Select start and end dates"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label>Reason for Leave / Permission</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="reason"
                          value={leaveForm.reason}
                          onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                          placeholder="Please provide a reason for your leave request..."
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" variant="primary" disabled={leaveSubmitting}>
                        {leaveSubmitting ? "Submitting..." : "Submit Leave Request"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Tab.Pane>

              <Tab.Pane eventKey="payroll" className="pt-3">
                <h5 className="fw-bold mb-4">Payroll Essentials</h5>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Bank Account Details</Form.Label>
                      <Form.Control type="text" value={profile.bank_account_details || "Not provided"} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>PAN Number</Form.Label>
                      <Form.Control type="text" value={profile.pan_number || "Not provided"} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>PF / UAN Number</Form.Label>
                      <Form.Control type="text" value={profile.pf_uan_number || "Not provided"} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="personal" className="pt-3">
                <h5 className="fw-bold mb-4">Personal Information</h5>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                        selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                        onChange={(date) => {
                          const formatted = date ? date.toISOString().split('T')[0] : "";
                          setFormData({ ...formData, date_of_birth: formatted });
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="YYYY-MM-DD"
                        showYearDropdown
                        yearDropdownItemNumber={12}
                        scrollableYearDropdown
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Control
                        type="text"
                        name="blood_group"
                        value={formData.blood_group || ""}
                        onChange={handleChange}
                        placeholder="e.g. A+, B-, O+"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label><FiMail className="me-2" />Work Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label><FiPhone className="me-2" />Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                     <Form.Group className="mb-4">
                       <Form.Label><FiHome className="me-2" />Current Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Emergency Contact Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergency_name"
                        value={formData.emergency_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Emergency Contact Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergency_phone"
                       value={formData.emergency_phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Card className="shadow-sm border-0 mt-4">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">Actions</h6>
                    <div className="d-flex gap-2">
                      {!editMode ? (
                        <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                          <FiSave className="me-2" />Edit Personal Info
                        </Button>
                      ) : (
                        <>
                          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
                            {saving ? <Spinner animation="border" size="sm" /> : <><FiSave className="me-2" />Save Changes</>}
                          </Button>
                          <Button variant="secondary" onClick={() => { setEditMode(false); fetchProfile(); }}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                    {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
                    {success && <Alert variant="success" className="mt-3 mb-0">{success}</Alert>}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export default EmployeeProfile;
