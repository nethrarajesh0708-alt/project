import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "axios";

const AttendanceContent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [employees, setEmployees] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceReports();
  }, []);

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

  const fetchAttendanceReports = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${BASE_URL}backend/api/attendence/reports.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          let data = res.data.reports || [];
          if (selectedEmployee) {
            data = data.filter((r) => r.employee_id == selectedEmployee);
          }
          if (selectedMonth) {
            data = data.filter((r) => r.date?.startsWith(selectedMonth));
          }
          setReports(data);
        } else {
          setError(res.data.message || "Failed to fetch attendance");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      });
  };

  const getStatusBadge = (record) => {
    if (record.is_weekend) return <Badge bg="secondary">Weekend</Badge>;
    if (record.is_holiday) return <Badge bg="info">Holiday</Badge>;
    if (record.is_late) return <Badge bg="warning">Late</Badge>;
    if (record.status === "present") return <Badge bg="success">Present</Badge>;
    if (record.status === "absent") return <Badge bg="danger">Absent</Badge>;
    return <Badge bg="light" text="dark">Unknown</Badge>;
  };

  return (
    <div>
      <h2 className="mb-4">Attendance Management</h2>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Employee</Form.Label>
                <Form.Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.user_id})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Month</Form.Label>
                <Form.Control
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12} className="d-flex justify-content-end">
              <Button variant="primary" onClick={fetchAttendanceReports}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : reports.length === 0 ? (
            <p className="text-muted text-center">No attendance records found.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.user_id || record.employee_id}</td>
                    <td>
                      {record.first_name} {record.last_name}
                    </td>
                    <td>{record.date}</td>
                    <td>{getStatusBadge(record)}</td>
                    <td>
                      {record.is_weekend
                        ? "Weekend"
                        : record.is_holiday
                        ? "Holiday"
                        : record.is_late
                        ? "Late Arrival"
                        : record.status === "present"
                        ? "On Time"
                        : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttendanceContent;
