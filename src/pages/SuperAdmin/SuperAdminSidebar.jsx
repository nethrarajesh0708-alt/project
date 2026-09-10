import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiShield,
  FiGrid,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const SuperAdminSidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useSuperAdmin();

  const handleLogout = async () => {
    await logout();
    navigate("/super-admin/login");
  };

  const navItems = [
    { path: "/super-admin/dashboard", label: "Overview", icon: FiHome },
    { path: "/super-admin/employees", label: "Employees", icon: FiUsers },
    { path: "/super-admin/roles", label: "Roles & Permissions", icon: FiShield },
    { path: "/super-admin/modules", label: "Modules", icon: FiGrid },
    { path: "/super-admin/reports", label: "Reports", icon: FiBarChart2 },
    { path: "/super-admin/settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className={`super-admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3>{collapsed ? "SA" : "Super Admin"}</h3>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveTab(item.label)}
            title={collapsed ? item.label : ""}
          >
            <item.icon className="sidebar-icon" />
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="sidebar-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
