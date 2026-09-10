import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdmin.css";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/super_admin/dashboard_stats.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Employees", value: stats?.total_employees ?? 0, color: "#2563eb", icon: "👥" },
    { title: "Active Employees", value: stats?.active_employees ?? 0, color: "#16a34a", icon: "✅" },
    { title: "Inactive Employees", value: stats?.inactive_employees ?? 0, color: "#dc2626", icon: "❌" },
    { title: "Total Users", value: stats?.total_users ?? 0, color: "#2563eb", icon: "👤" },
    { title: "Roles", value: stats?.total_roles ?? 0, color: "#7c3aed", icon: "🔐" },
    { title: "Permissions", value: stats?.total_permissions ?? 0, color: "#d97706", icon: "🔑" },
    { title: "Departments", value: stats?.total_departments ?? 0, color: "#0891b2", icon: "🏢" },
    { title: "Groups", value: stats?.total_groups ?? 0, color: "#4f46e5", icon: "👥" },
    { title: "Pending Leaves", value: stats?.pending_leave_requests ?? 0, color: "#d97706", icon: "📝" },
    { title: "Total Tasks", value: stats?.total_tasks ?? 0, color: "#16a34a", icon: "✅" },
    { title: "Attendance Records", value: stats?.total_attendance_records ?? 0, color: "#2563eb", icon: "📅" },
  ];

  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="super-admin-main">
        <header className="super-admin-header">
          <div>
            <h1>Super Admin Dashboard</h1>
            <p className="super-admin-datetime">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              | {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </header>

        <div className="super-admin-content">
          <h2 className="section-title">System Overview</h2>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="super-admin-cards-grid">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="super-admin-stat-card"
                  style={{ "--card-color": card.color }}
                >
                  <div className="super-admin-card-icon">{card.icon}</div>
                  <div className="super-admin-card-info">
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

export default SuperAdminDashboard;
