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

const WeekendsContent = () => {
  const [weekends, setWeekends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWeekend, setEditingWeekend] = useState(null);
  const [formData, setFormData] = useState({
    day_name: "",
    day_order: "",
  });
  const BASE_URL = import.meta.env.VITE_API_URL;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchWeekends();
  }, []);

  const fetchWeekends = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}backend/api/common/weekends.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setWeekends(res.data.weekends || []);
        } else {
          setError(res.data.message || "Failed to fetch weekends");
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
      if (editingWeekend) {
        await axios.post(
          `${BASE_URL}backend/api/common/weekends.php`,
          { ...formData, id: editingWeekend.id },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      } else {
        await axios.post(
          `${BASE_URL}backend/api/common/weekends.php`,
          formData,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      }
      setShowModal(false);
      setEditingWeekend(null);
      setFormData({ day_name: "", day_order: "" });
      fetchWeekends();
    } catch (err) {
      console.error(err);
      setError("Failed to save weekend");
    }
  };

  const handleEdit = (weekend) => {
    setEditingWeekend(weekend);
    setFormData({
      day_name: weekend.day_name || "",
      day_order: weekend.day_order || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this weekend?")) return;
    try {
      await axios.post(
        `${BASE_URL}backend/api/common/weekends.php`,
        { id },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      fetchWeekends();
    } catch (err) {
      console.error(err);
      setError("Failed to delete weekend");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Weekend Management</h2>
        <Button variant="primary" onClick={() => { setEditingWeekend(null); setFormData({ day_name: "", day_order: "" }); setShowModal(true); }}>
          + Add Weekend
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
                  <th>Day Name</th>
                  <th>Day Order</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {weekends.map((weekend) => (
                  <tr key={weekend.id}>
                    <td>{weekend.id}</td>
                    <td>{weekend.day_name}</td>
                    <td>{weekend.day_order}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => handleEdit(weekend)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(weekend.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {weekends.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No weekends configured.
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
          <Modal.Title>{editingWeekend ? "Edit Weekend" : "Add Weekend"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Day Name</Form.Label>
              <Form.Select
                value={formData.day_name}
                onChange={(e) =>
                  setFormData({ ...formData, day_name: e.target.value })
                }
                required
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Day Order (1=Monday, 7=Sunday)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="7"
                value={formData.day_order}
                onChange={(e) =>
                  setFormData({ ...formData, day_order: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingWeekend ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WeekendsContent;
