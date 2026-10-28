import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Spinner, Modal, Card, Row, Col } from 'react-bootstrap';
import { FiSearch, FiEye, FiMail, FiPhone, FiBriefcase, FiCalendar, FiFileText } from 'react-icons/fi';

const ManagerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    let data = employees;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(e =>
        (e.first_name && e.first_name.toLowerCase().includes(term)) ||
        (e.last_name && e.last_name.toLowerCase().includes(term)) ||
        (e.employee_id && e.employee_id.toLowerCase().includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term))
      );
    }
    if (departmentFilter) {
      data = data.filter(e => e.department_id === departmentFilter || e.department === departmentFilter);
    }
    setFilteredEmployees(data);
  }, [employees, searchTerm, departmentFilter]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/employees`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setEmployees(data.employees || []);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backend/api/department/fetctDepartment.php`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setDepartments(data.departments || []);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  const viewDetails = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = { active: 'success', inactive: 'secondary', on_leave: 'warning' };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2 className="section-title">Team Members</h2>
        <div className="section-filters">
          <Form.Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Form.Select>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <Form.Control
              placeholder="Search by name, ID, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>ID</th>
            <th>Department</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((e) => (
            <tr key={e.id}>
              <td>
                <strong>{e.first_name} {e.last_name}</strong>
              </td>
              <td>{e.employee_id}</td>
              <td>{e.department_name || e.department || '--'}</td>
              <td>
                <small>
                  <FiMail className="me-1" />{e.email}<br />
                  <FiPhone className="me-1" />{e.phone || '--'}
                </small>
              </td>
              <td>{getStatusBadge(e.status)}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => viewDetails(e)}>
                  <FiEye size={16} /> View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onClose={() => setShowModal(false)} centered size="lg">
        <Modal.Header>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <Row>
              <Col md={4} className="text-center">
                <div className="employee-avatar mx-auto mb-3">
                  {selectedEmployee.first_name?.charAt(0)}{selectedEmployee.last_name?.charAt(0)}
                </div>
                <h5>{selectedEmployee.first_name} {selectedEmployee.last_name}</h5>
                <Badge bg={selectedEmployee.status === 'active' ? 'success' : 'secondary'}>
                  {selectedEmployee.status}
                </Badge>
              </Col>
              <Col md={8}>
                <Card>
                  <Card.Body>
                    <h6 className="mb-3"><FiFileText className="me-2" />Personal Information</h6>
                    <p><strong>Employee ID:</strong> {selectedEmployee.employee_id}</p>
                    <p><strong>Email:</strong> {selectedEmployee.email}</p>
                    <p><strong>Phone:</strong> {selectedEmployee.phone || '--'}</p>
                    <p><strong>Department:</strong> {selectedEmployee.department_name || '--'}</p>
                    <p><strong>Designation:</strong> {selectedEmployee.designation || '--'}</p>
                    <p><strong>Date of Joining:</strong> {selectedEmployee.date_of_joining || '--'}</p>


                    <h6 className="mb-3 mt-3"><FiCalendar className="me-2" />Work History</h6>
                    <p><strong>Total Leaves Taken:</strong> {selectedEmployee.total_leaves || 0}</p>
                    <p><strong>Attendance Rate:</strong> {selectedEmployee.attendance_rate || 0}%</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerEmployees;