import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { FiSearch, FiCheck, FiX, FiClock, FiAlertCircle, FiEdit } from 'react-icons/fi';

/**
 * ManagerLeaveRequests - Leave management section for managers
 * Features:
 * - Display pending leave requests from team members
 * - Approve/Reject/Defer leave requests with confirmation modal
 * - Filter by employee name, leave type, and status
 * - View employee leave balance
 */
const ManagerLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [action, setAction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState('');
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  useEffect(() => { fetchLeaves(); }, []);

  useEffect(() => {
    let data = leaves;
    if (statusFilter) data = data.filter(l => l.status === statusFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(l =>
        l.employee_name?.toLowerCase().includes(term) ||
        l.employee_id?.toLowerCase().includes(term) ||
        l.leave_type?.toLowerCase().includes(term)
      );
    }
    setFilteredLeaves(data);
  }, [leaves, searchTerm, statusFilter]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/leave_requests?status=${statusFilter}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setLeaves(data.requests || data.leaves || []);
    } catch (err) {
      console.error('Failed to fetch leaves', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (leave, act) => {
    setSelectedLeave(leave);
    setAction(act);
    setRemarks('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedLeave) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/leave_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedLeave.id,
          action,
          remarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchLeaves();
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error('Action failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      deferred: 'info',
    };
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
        <h2 className="section-title">Leave Requests</h2>
        <div className="section-filters">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="deferred">Deferred</option>
          </Form.Select>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <Form.Control
              placeholder="Search by name, ID, or leave type"
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
              <th>Type</th>
              <th>Dates</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((l) => (
              <tr key={l.id}>
                <td>
                  <strong>{l.employee_name}</strong>
                  <br />
                  <small className="text-muted">{l.employee_id}</small>
                </td>
                <td>{l.leave_type}</td>
                <td>
                  {l.from_date} to {l.to_date}
                </td>
                <td>{l.days}</td>
                <td>{getStatusBadge(l.status)}</td>
                <td>
                  {l.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleAction(l, 'approve')}
                        title="Approve"
                      >
                        <FiCheck size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction(l, 'reject')}
                        title="Reject"
                      >
                        <FiX size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleAction(l, 'defer')}
                        title="Defer"
                      >
                        <FiClock size={16} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>{action} Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <p>
                Confirm <strong>{action}</strong> for <strong>{selectedLeave.employee_name}</strong>?
              </p>
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remarks (optional)"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAction} disabled={submitting}>
            {submitting ? 'Processing...' : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerLeaveRequests;
