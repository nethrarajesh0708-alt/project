import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Attendance');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/attendance.php?month=${month}&year=${year}`, {
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    } finally {
      setLoading(false);
    }
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
            <h1>Attendance Overview</h1>
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
          ) : data ? (
            <>
              <div className="hr-cards-grid mb-4">
                <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
                  <div className="hr-card-icon">📅</div>
                  <div className="hr-card-info"><h3>{data.summary.total_employees}</h3><p>Total Employees</p></div>
                </div>
                <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
                  <div className="hr-card-icon">✅</div>
                  <div className="hr-card-info"><h3>{data.summary.present}</h3><p>Present</p></div>
                </div>
                <div className="hr-stat-card" style={{ '--card-color': '#dc2626' }}>
                  <div className="hr-card-icon">❌</div>
                  <div className="hr-card-info"><h3>{data.summary.absent}</h3><p>Absent</p></div>
                </div>
                <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
                  <div className="hr-card-icon">⏰</div>
                  <div className="hr-card-info"><h3>{data.summary.late}</h3><p>Late</p></div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data?.map((record) => (
                      <tr key={record.id}>
                        <td>{record.first_name} {record.last_name} ({record.user_id})</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.check_in || 'N/A'}</td>
                        <td>
                          {record.is_weekend && <span className="badge bg-info me-1">Weekend</span>}
                          {record.is_holiday && <span className="badge bg-warning me-1">Holiday</span>}
                          {record.is_late && <span className="badge bg-danger">Late</span>}
                          {!record.is_late && record.check_in && <span className="badge bg-success">On Time</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No attendance data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrAttendance;
