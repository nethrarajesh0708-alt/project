import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Alert, Button } from 'react-bootstrap';
import ManagerSidebar from './ManagerSidebar';
import ManagerLeaveRequests from './ManagerLeaveRequests';
import ManagerAttendance from './ManagerAttendance';
import ManagerEmployees from './ManagerEmployees';
import ManagerChat from './ManagerChat';
import PageErrorBoundary from '../../components/common/ErrorBoundary';
import { api } from '../../api';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [_profileLoading, setProfileLoading] = useState(true);
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

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

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/dashboard_stats`, { credentials: 'include' });
      if (res.status === 401) throw new Error('Unauthorized');
      if (res.status === 403) throw new Error('Forbidden');
      if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
      let data;
      try { data = await res.json(); } catch { throw new Error('Invalid response from server'); }
      if (data.success) { setError(null); setStats(data.data); }
      else setError(data.message || 'Failed to load stats');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Team Members', value: stats?.total_team_members ?? 0, icon: '👥', color: '#2563eb', tab: 'employees' },
    { title: 'Pending Leaves', value: stats?.pending_leaves ?? 0, icon: '📝', color: '#d97706', tab: 'leaves' },
    { title: 'Absent Today', value: stats?.absent_today ?? 0, icon: '❌', color: '#dc2626', tab: 'attendance' },
    { title: 'Present Today', value: stats?.present_today ?? 0, icon: '✅', color: '#16a34a', tab: 'attendance' },
    { title: 'On Leave Today', value: stats?.on_leave_today ?? 0, icon: '🏖️', color: '#0284c7', tab: 'attendance' },
  ];

  const handleCardClick = (card) => setActiveTab(card.tab);

  const renderRecentActivity = () => {
    const leaves = stats?.recent_leaves || [];
    const activity = stats?.recent_activity || [];
    if (!leaves.length && !activity.length) {
      return <p className="text-muted">No recent activity.</p>;
    }
    return (
      <div>
        {leaves.map((l) => (
          <div key={'l' + l.id} className="d-flex justify-content-between border-bottom py-2">
            <span>{l.employee_name} — {l.leave_type}</span>
            <span className="text-muted">({l.status}) {l.from_date}→{l.to_date}</span>
          </div>
        ))}
        {activity.map((a) => (
          <div key={'a' + a.id} className="d-flex justify-content-between border-bottom py-2">
            <span>{a.employee_name} — {a.date}</span>
            <span className="text-muted">{a.status} {a.check_in || ''}→{a.check_out || ''}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="manager-dashboard-content">
            <h2 className="section-title">Dashboard Overview</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            ) : error ? (
              <Alert variant="warning">Unable to load dashboard stats. <Button size="sm" variant="primary" onClick={fetchDashboardStats}>Retry</Button></Alert>
            ) : (
              <>
                <div className="manager-cards-grid">
                  {cards.map((card, idx) => (
                    <div key={idx} className="manager-stat-card" onClick={() => handleCardClick(card)} style={{ '--card-color': card.color }}>
                      <div className="manager-card-icon">{card.icon}</div>
                      <div className="manager-card-info">
                        <h3>{card.value}</h3>
                        <p>{card.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4>Recent Activity</h4>
                  {renderRecentActivity()}
                </div>
              </>
            )}
          </div>
        );
      case 'leaves':
        return <ManagerLeaveRequests />;
      case 'attendance':
        return <ManagerAttendance />;
      case 'employees':
        return <ManagerEmployees />;
      case 'chat':
        return <ManagerChat />;
      default:
        return <div>Section not found</div>;
    }
  };

  const displayName = profile?.name || user?.name || 'Manager';

  return (
    <PageErrorBoundary>
      <div className="manager-dashboard-layout">
        <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="manager-dashboard-main">
          <header className="manager-dashboard-header">
            <div>
              <h1>Welcome, {displayName}</h1>
              <p className="manager-datetime">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </header>
          {renderContent()}
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default ManagerDashboard;
