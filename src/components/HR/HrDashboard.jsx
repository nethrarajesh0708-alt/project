import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HrSidebar from './HrSidebar';
import PageErrorBoundary from '../../components/common/ErrorBoundary';
import { api } from '../../api';
import './HrDashboard.css';

const HrDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [_profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  const getName = () => {
    if (profile?.name) return profile.name;
    if (!user?.email) return 'HR';
    const local = user.email.split('@')[0];
    return local.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  useEffect(() => {
    // Mock stats - no backend needed
    setStats({
      total_employees: 5,
      active_employees: 4,
      inactive_employees: 1,
      present_today: 3,
      pending_leave: 2,
      tasks_completed: 1,
      total_hours: 38.5,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const empId = user?.employee_id || user?.id || '';
    if (!empId) {
      setProfileLoading(false);
      return;
    }
    api.getEmployee(empId)
      .then(({ data, error: err }) => {
        if (!err && data) setProfile(data);
      })
      .finally(() => {
        setProfileLoading(false);
      });
  }, [user?.employee_id, user?.id]);

  const cards = [
    { title: 'Total Employees', value: stats?.total_employees ?? 0, icon: '👥', color: '#2563eb', path: '/hr/employees' },
    { title: 'Active Employees', value: stats?.active_employees ?? 0, icon: '🟢', color: '#16a34a', path: '/hr/employees' },
    { title: 'Inactive Employees', value: stats?.inactive_employees ?? 0, icon: '🔴', color: '#dc2626', path: '/hr/employees' },
    { title: 'Present Today', value: stats?.present_today ?? 0, icon: '📅', color: '#2563eb', path: '/hr/attendance' },
    { title: 'Pending Leave', value: stats?.pending_leave ?? 0, icon: '📝', color: '#d97706', path: '/hr/leave-requests' },
    { title: 'Tasks Completed', value: stats?.tasks_completed ?? 0, icon: '✅', color: '#16a34a', path: '/hr/tasks' },
    { title: 'Hours Today', value: stats?.total_hours ?? 0, icon: '⏱', color: '#7c3aed', path: '/hr/time-tracking' },
  ];

  const handleCardClick = (card) => {
    navigate(card.path);
  };

  return (
    <PageErrorBoundary>
      <div className="hr-dashboard-layout">
        <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="hr-dashboard-main">
          <header className="hr-dashboard-header">
            <div>
              <h1>Hello, {getName()}</h1>
              <p className="hr-datetime">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </header>

          <div className="hr-dashboard-content">
            <h2 className="section-title">Dashboard Overview</h2>

            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="hr-cards-grid">
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="hr-stat-card"
                    onClick={() => handleCardClick(card)}
                    style={{ '--card-color': card.color }}
                  >
                    <div className="hr-card-icon">{card.icon}</div>
                    <div className="hr-card-info">
                      <h3>{card.value}</h3>
                      <p>{card.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default HrDashboard;
