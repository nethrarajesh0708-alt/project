import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockEmployees } from '../../mock/employees';
import './HrDashboard.css';

const HrTasks = () => {
  const [activeTab, setActiveTab] = useState('Tasks');

  const tasks = [
    { id: 1, employeeName: 'Ravi Kumar', taskTitle: 'Complete Q3 report', progress: 100, status: 'completed', updatedAt: '2025-07-10', completedAt: '2025-07-10' },
    { id: 2, employeeName: 'Anita Patel', taskTitle: 'Onboard new hires', progress: 60, status: 'in_progress', updatedAt: '2025-07-14', completedAt: null },
    { id: 3, employeeName: 'Rohan Mehta', taskTitle: 'Sales targets review', progress: 0, status: 'pending', updatedAt: '2025-07-08', completedAt: null },
    { id: 4, employeeName: 'Priya Sharma', taskTitle: 'Budget audit', progress: 80, status: 'in_progress', updatedAt: '2025-07-13', completedAt: null },
  ];

  const summary = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: 'bg-success',
      pending: 'bg-secondary',
      in_progress: 'bg-primary',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status.replace('_', ' ')}</span>;
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
                    <td>{task.employeeName}</td>
                    <td>{task.taskTitle}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress" style={{ width: '120px', height: '8px' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <small>{task.progress}%</small>
                      </div>
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{task.updatedAt}</td>
                    <td>{task.completedAt || 'N/A'}</td>
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

export default HrTasks;