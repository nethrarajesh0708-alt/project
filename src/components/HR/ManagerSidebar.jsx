import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMessageCircle,
} from 'react-icons/fi';

const ManagerSidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/LoginFetch');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'leaves', label: 'Leave Requests', icon: FiFileText },
    { id: 'attendance', label: 'Attendance', icon: FiCalendar },
    { id: 'employees', label: 'Team Members', icon: FiUsers },
    { id: 'chat', label: 'Team Chat', icon: FiMessageCircle },
    { id: 'profile', label: 'My Profile', icon: FiUser },
  ];

  return (
    <div className={`manager-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="manager-sidebar-header">
        <h3>{collapsed ? 'MGR' : 'Manager Panel'}</h3>
        <button
          className="manager-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <nav className="manager-sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.id === 'dashboard' ? '/manager/dashboard' : `/manager/${item.id}`}
            className={({ isActive }) =>
              `manager-sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setActiveTab(item.label)}
            title={collapsed ? item.label : ''}
          >
            <item.icon className="manager-sidebar-icon" />
            {!collapsed && <span className="manager-sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="manager-sidebar-footer">
        <button className="manager-logout-btn" onClick={handleLogout}>
          <FiLogOut className="manager-sidebar-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;