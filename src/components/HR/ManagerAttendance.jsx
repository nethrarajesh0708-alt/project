import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Spinner, Modal, InputGroup, Dropdown } from 'react-bootstrap';
import { FiSearch, FiCalendar, FiCheck, FiX, FiEye, FiFilter, FiPlus } from 'react-icons/fi';

/**
 * ManagerAttendance - Attendance tracking section for managers
 * Features:
 * - View team attendance records
 * - Filter by date range and status
 * - Attendance reports/trends
 * - Detailed view modal
 */
const ManagerAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  useEffect(() => { fetchAttendance(); }, []);

  useEffect(() => {
    let data = attendance;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(r =>
        r.employee_name?.toLowerCase().includes(term) ||
        r.employee_id?.toLowerCase().includes(term)
      );
    }
    if (dateFilter) data = data.filter(r => r.date === dateFilter);
    if (statusFilter) data = data.filter(r => r.status === statusFilter);
    setFilteredAttendance(data);
  }, [attendance, searchTerm, dateFilter, statusFilter]);

  const fetchAttendance = async () => {
    try {
      const url = dateFilter
        ? `${BASE_URL}/backend/api/manager/attendance?date=${dateFilter}`
        : `${BASE_URL}/backend/api/manager/attendance`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAttendance(data.records || data.attendance || []);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDateFilter(date);
    if (date) {
      fetchAttendanceByDate(date);
    }
  };

  const fetchAttendanceByDate = async (date) => {
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/attendance?date=${date}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setAttendance(data.records || data.attendance || []);
    } catch (err) {
      console.error('Failed to fetch attendance by date', err);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      present: 'success',
      absent: 'danger',
      late: 'warning',
      half_day: 'info',
      on_leave: 'primary',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
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
        <h2 className="section-title">Attendance Tracking</h2>
        <div className="section-filters">
          <Form.Control
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            style={{ width: 'auto' }}
          />
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
          </Form.Select>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <Form.Control
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="manager-table">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.employee_name}</strong>
                  <br />
                  <small className="text-muted">{r.employee_id}</small>
                </td>
                <td>{r.date}</td>
                <td>{r.check_in || '--'}</td>
                <td>{r.check_out || '--'}</td>
                <td>{r.hours || 0}h</td>
                <td>{getStatusBadge(r.status)}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => viewDetails(r)}>
                    <FiEye size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <>
              <p><strong>Employee:</strong> {selectedRecord.employee_name}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Check In:</strong> {selectedRecord.check_in || '--'}</p>
              <p><strong>Check Out:</strong> {selectedRecord.check_out || '--'}</p>
              <p><strong>Hours Worked:</strong> {selectedRecord.hours || 0}h</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              {selectedRecord.remarks && <p><strong>Remarks:</strong> {selectedRecord.remarks}</p>}
            </>
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

export default ManagerAttendance;
