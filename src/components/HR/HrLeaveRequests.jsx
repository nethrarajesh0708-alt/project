import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Leave Requests');
  const [filter, setFilter] = useState('');
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const url = `${BASE_URL}backend/api/hr/leave_requests.php${filter ? `?status=${filter}` : ''}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch leave requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/leave_requests.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      }
    } catch (err) {
      console.error('Failed to update leave request', err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Leave Requests</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="mb-3">
            <select 
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.first_name} {req.last_name} ({req.user_id})</td>
                      <td>{req.leave_type_name || `Type ${req.leave_type_id}`}</td>
                      <td>{formatDate(req.start_date)}</td>
                      <td>{formatDate(req.end_date)}</td>
                      <td>{req.reason}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        {req.status === 'pending' && (
                          <>
                            <button 
                              className="btn btn-success btn-sm me-1"
                              onClick={() => handleAction(req.id, 'approve')}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleAction(req.id, 'reject')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.approved_by_name && <small className="text-muted">By {req.approved_by_name}</small>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrLeaveRequests;
