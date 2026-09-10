import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HrSidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/LoginFetch');
  };

  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/hr/employees', label: 'Employees', icon: '👥' },
    { path: '/hr/attendance', label: 'Attendance', icon: '📅' },
    { path: '/hr/leave-requests', label: 'Leave Requests', icon: '📝' },
    { path: '/hr/profile', label: 'HR Profile', icon: '👤' },
  ];

  return (
    <div className={`hr-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>{collapsed ? 'HR' : 'HR Panel'}</h3>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setActiveTab(item.label)}
            title={collapsed ? item.label : ''}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default HrSidebar;
