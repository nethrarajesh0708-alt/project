import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrTimeTracking = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Time Tracking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSessions();
  }, [date]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=history&limit=100`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const filtered = data.sessions.filter(s => s.session_date === date);
        setSessions(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setLoading(false);
    }
  };

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

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
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
                      <td>EMP{String(session.employee_id).padStart(4, '0')}</td>
                      <td>{session.start_time ? new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                      <td>{session.end_time ? new Date(session.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Running...'}</td>
                      <td>{formatDuration(session.duration_minutes)}</td>
                      <td>{session.session_date}</td>
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

export default HrTimeTracking;
