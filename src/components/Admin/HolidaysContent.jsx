import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const HolidaysContent = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    holiday_name: "",
    date: "",
    description: "",
  });
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}backend/api/common/holidays.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setHolidays(res.data.holidays || []);
        } else {
          setError(res.data.message || "Failed to fetch holidays");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHoliday) {
        await axios.post(
          `${BASE_URL}backend/api/common/holidays.php`,
          { ...formData, id: editingHoliday.id },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      } else {
        await axios.post(
          `${BASE_URL}backend/api/common/holidays.php`,
          formData,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      }
      setShowModal(false);
      setEditingHoliday(null);
      setFormData({ holiday_name: "", date: "", description: "" });
      fetchHolidays();
    } catch (err) {
      console.error(err);
      setError("Failed to save holiday");
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      holiday_name: holiday.holiday_name || holiday.name || "",
      date: holiday.date || "",
      description: holiday.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this holiday?")) return;
    try {
      await axios.post(
        `${BASE_URL}backend/api/common/holidays.php`,
        { id },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      fetchHolidays();
    } catch (err) {
      console.error(err);
      setError("Failed to delete holiday");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Holiday Management</h2>
        <Button variant="primary" onClick={() => { setEditingHoliday(null); setFormData({ holiday_name: "", date: "", description: "" }); setShowModal(true); }}>
          + Add Holiday
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
                  <th>ID</th>
                  <th>Holiday Name</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td>{holiday.id}</td>
                    <td>{holiday.holiday_name || holiday.name}</td>
                    <td>{holiday.date}</td>
                    <td>{holiday.description || "-"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => handleEdit(holiday)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(holiday.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No holidays found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingHoliday ? "Edit Holiday" : "Add Holiday"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Holiday Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.holiday_name}
                onChange={(e) =>
                  setFormData({ ...formData, holiday_name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingHoliday ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HolidaysContent;
