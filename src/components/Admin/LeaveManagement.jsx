import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

const LeaveManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRequests();
    fetchEmployees();
    fetchLeaveTypes();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}backend/api/leave/leave_requests.php`, {
        withCredentials: true,
        params: filterStatus ? { status: filterStatus } : {},
      })
      .then((res) => {
        if (res.data.success) {
          setRequests(res.data.requests || []);
        } else {
          setError(res.data.message || "Failed to fetch leave requests");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      });
  };

  const fetchEmployees = () => {
    axios
      .get(`${BASE_URL}backend/api/employees/view.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setEmployees(res.data.employees || []);
        }
      })
      .catch((err) => console.error("Failed to fetch employees", err));
  };

  const fetchLeaveTypes = () => {
    axios
      .get(`${BASE_URL}backend/api/leave/leave_types.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setLeaveTypes(res.data.leave_types || []);
        }
      })
      .catch((err) => console.error("Failed to fetch leave types", err));
  };

  const handleApprove = (id) => {
    axios
      .post(
        `${BASE_URL}backend/api/leave/leave_requests.php`,
        { action: "approve", id },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          setSuccess(res.data.message);
          fetchRequests();
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to approve leave");
      });
  };

  const handleReject = (id) => {
    if (!window.confirm("Are you sure to reject this leave request?")) return;
    axios
      .post(
        `${BASE_URL}backend/api/leave/leave_requests.php`,
        { action: "reject", id },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          setSuccess(res.data.message);
          fetchRequests();
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to reject leave");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}backend/api/leave/leave_requests.php`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.success) {
        setSuccess(res.data.message);
        setShowModal(false);
        setEditingRequest(null);
        setFormData({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" });
        fetchRequests();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save leave request");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leave Management</h2>
        <Button variant="primary" onClick={() => { setEditingRequest(null); setFormData({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" }); setShowModal(true); }}>
          + New Leave Request
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); fetchRequests(); }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        {req.first_name} {req.last_name}
                        <br />
                        <small className="text-muted">{req.user_id}</small>
                      </td>
                      <td>{req.leave_type_name}</td>
                      <td>{req.start_date}</td>
                      <td>{req.end_date}</td>
                      <td>{req.days}</td>
                      <td>{req.reason || "-"}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        {req.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2"
                              onClick={() => handleApprove(req.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(req.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRequest ? "Edit Leave Request" : "New Leave Request"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Select
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.user_id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                value={formData.leave_type_id}
                onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeaveManagement;
