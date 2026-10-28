import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockLeaveRequests } from '../../mock/leaves';
import './HrDashboard.css';

const HrLeaveRequests = () => {
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('Leave Requests');

  const filtered = filter
    ? requests.filter(r => r.status.toLowerCase() === filter.toLowerCase())
    : requests;

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : r.status } : r
    ));
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: 'bg-warning',
      Approved: 'bg-success',
      Rejected: 'bg-danger',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id}>
                    <td>{req.employeeName} ({req.employeeId})</td>
                    <td>{req.leaveType}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.days}</td>
                    <td>{req.reason}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td>
                      {req.status === 'Pending' && (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrLeaveRequests;