import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tasks');
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/tasks.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: 'bg-success',
      pending: 'bg-secondary',
      in_progress: 'bg-primary',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status.replace('_', ' ')}</span>;
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
            <h1>Task Monitoring</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          {summary && (
            <div className="hr-cards-grid mb-4">
              <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
                <div className="hr-card-icon">📋</div>
                <div className="hr-card-info"><h3>{summary.total}</h3><p>Total Tasks</p></div>
              </div>
              <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
                <div className="hr-card-icon">✅</div>
                <div className="hr-card-info"><h3>{summary.completed}</h3><p>Completed</p></div>
              </div>
              <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
                <div className="hr-card-icon">⏳</div>
                <div className="hr-card-info"><h3>{summary.pending}</h3><p>Pending</p></div>
              </div>
              <div className="hr-stat-card" style={{ '--card-color': '#7c3aed' }}>
                <div className="hr-card-icon">🔄</div>
                <div className="hr-card-info"><h3>{summary.in_progress}</h3><p>In Progress</p></div>
              </div>
            </div>
          )}

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
                    <th>Task</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.employee_name}</td>
                      <td>{task.task_title}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress" style={{ width: '120px', height: '8px' }}>
                            <div className="progress-bar" role="progressbar" style={{ width: `${task.progress}%` }}></div>
                          </div>
                          <small>{task.progress}%</small>
                        </div>
                      </td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td>{formatDate(task.updated_at)}</td>
                      <td>{task.completed_at ? formatDate(task.completed_at) : 'N/A'}</td>
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

export default HrTasks;
