import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/dashboard_stats.php`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch HR stats', err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Employees', value: stats?.total_employees ?? 0, icon: '👥', color: '#2563eb', path: '/hr/employees', filter: null },
    { title: 'Active Employees', value: stats?.active_employees ?? 0, icon: '🟢', color: '#16a34a', path: '/hr/employees', filter: 'active' },
    { title: 'Inactive Employees', value: stats?.inactive_employees ?? 0, icon: '🔴', color: '#dc2626', path: '/hr/employees', filter: 'inactive' },
    { title: 'Present Today', value: stats?.present_today ?? 0, icon: '📅', color: '#2563eb', path: '/hr/attendance' },
    { title: 'Pending Leave', value: stats?.pending_leave ?? 0, icon: '📝', color: '#d97706', path: '/hr/leave-requests' },
    { title: 'Tasks Completed', value: stats?.tasks_completed ?? 0, icon: '✅', color: '#16a34a', path: '/hr/tasks' },
    { title: 'Hours Today', value: stats?.total_hours ?? 0, icon: '⏱', color: '#7c3aed', path: '/hr/time-tracking' },
  ];

  const handleCardClick = (card) => {
    if (card.filter) {
      navigate(card.path, { state: { filter: card.filter } });
    } else {
      navigate(card.path);
    }
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Welcome, {user?.username || 'HR'}</h1>
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
  );
};

export default HrDashboard;
