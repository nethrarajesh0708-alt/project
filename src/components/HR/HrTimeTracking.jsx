import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrTimeTracking = () => {
  const [activeTab, setActiveTab] = useState('Time Tracking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const sessions = [
    { id: 1, employeeId: 1, startTime: '2025-07-14T09:00:00', endTime: '2025-07-14T17:30:00', durationMinutes: 510, sessionDate: '2025-07-14' },
    { id: 2, employeeId: 2, startTime: '2025-07-14T09:15:00', endTime: '2025-07-14T18:00:00', durationMinutes: 525, sessionDate: '2025-07-14' },
    { id: 3, employeeId: 3, startTime: '2025-07-14T09:00:00', endTime: null, durationMinutes: 0, sessionDate: '2025-07-14' },
    { id: 4, employeeId: 4, startTime: '2025-07-14T09:00:00', endTime: '2025-07-14T13:00:00', durationMinutes: 240, sessionDate: '2025-07-14' },
  ];

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Time Tracking</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Duration</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>EMP{String(session.employeeId).padStart(4, '0')}</td>
                    <td>{session.startTime ? new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                    <td>{session.endTime ? new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Running...'}</td>
                    <td>{formatDuration(session.durationMinutes)}</td>
                    <td>{session.sessionDate}</td>
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

export default HrTimeTracking;