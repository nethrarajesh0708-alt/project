import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Reports');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReports();
  }, [month, year]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [attRes, taskRes] = await Promise.all([
        fetch(`${BASE_URL}backend/api/hr/attendance.php?month=${month}&year=${year}`, { credentials: 'include' }),
        fetch(`${BASE_URL}backend/api/hr/tasks.php`, { credentials: 'include' }),
      ]);
      const attData = await attRes.json();
      const taskData = await taskRes.json();
      setData({
        attendance: attData.success ? attData : null,
        tasks: taskData.success ? taskData : null,
      });
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Reports</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="d-flex gap-2 mb-3 align-items-center">
            <select className="form-select" value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={{maxWidth: '120px'}}>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en-US', {month: 'long'})}</option>
              ))}
            </select>
            <select className="form-select" value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{maxWidth: '100px'}}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {data?.attendance && (
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-white border-0 fw-bold">Attendance Report</div>
                  <div className="card-body">
                    <div className="hr-cards-grid">
                      <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
                        <div className="hr-card-icon">📅</div>
                        <div className="hr-card-info"><h3>{data.attendance.summary.total_employees}</h3><p>Total Employees</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
                        <div className="hr-card-icon">✅</div>
                        <div className="hr-card-info"><h3>{data.attendance.summary.present}</h3><p>Present</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#dc2626' }}>
                        <div className="hr-card-icon">❌</div>
                        <div className="hr-card-info"><h3>{data.attendance.summary.absent}</h3><p>Absent</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
                        <div className="hr-card-icon">⏰</div>
                        <div className="hr-card-info"><h3>{data.attendance.summary.late}</h3><p>Late</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {data?.tasks && (
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-white border-0 fw-bold">Task Completion Report</div>
                  <div className="card-body">
                    <div className="hr-cards-grid">
                      <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
                        <div className="hr-card-icon">📋</div>
                        <div className="hr-card-info"><h3>{data.tasks.summary.total}</h3><p>Total Tasks</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
                        <div className="hr-card-icon">✅</div>
                        <div className="hr-card-info"><h3>{data.tasks.summary.completed}</h3><p>Completed</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
                        <div className="hr-card-icon">⏳</div>
                        <div className="hr-card-info"><h3>{data.tasks.summary.pending}</h3><p>Pending</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#7c3aed' }}>
                        <div className="hr-card-icon">🔄</div>
                        <div className="hr-card-info"><h3>{data.tasks.summary.in_progress}</h3><p>In Progress</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrReports;
