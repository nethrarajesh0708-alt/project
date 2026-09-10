import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Badge, Card } from "react-bootstrap";

const WorkRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchWorkRecords();
  }, []);

  const fetchWorkRecords = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}backend/api/tasks/employee/work_records.php`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setRecords(res.data.data || []);
        } else {
          setError(res.data.message || "Failed to load work records");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching work records: " + err.message);
        setLoading(false);
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="mt-3" style={{ transition: "none", transform: "none", boxShadow: "none" }}>
      <Card.Header>📋 Work Record</Card.Header>
      <Card.Body>
        {records.length === 0 ? (
          <Alert variant="info" className="text-center mb-0">No completed tasks yet</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Project Code</th>
                <th>Title</th>
                <th>Activity / Work Done</th>
                <th>Date of Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={record.task_id}>
                  <td>{idx + 1}</td>
                  <td>{record.project_code}</td>
                  <td>{record.title}</td>
                  <td>{record.activity || "-"}</td>
                  <td>{formatDate(record.completed_at)}</td>
                  <td>
                    <Badge bg="success">Completed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default WorkRecord;
