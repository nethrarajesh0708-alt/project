import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdmin.css";

const SuperAdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Reports");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [empRes, attRes, taskRes] = await Promise.all([
        fetch(`${BASE_URL}backend/api/super_admin/employees.php`, { credentials: "include" }),
        fetch(`${BASE_URL}backend/api/super_admin/dashboard_stats.php`, { credentials: "include" }),
      ]);

      const empData = await empRes.json();
      const attData = await attRes.json();

      setStats({
        employees: empData.success ? empData.data : [],
        dashboard: attData.success ? attData.data : {},
      });
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="super-admin-main">
        <header className="super-admin-header">
          <div>
            <h1>Reports</h1>
            <p className="super-admin-datetime">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </header>

        <div className="super-admin-content">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="reports-grid">
              <div className="report-card">
                <h3>Employee Summary</h3>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_employees || 0}</span>
                    <span className="report-label">Total Employees</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value text-success">{stats?.dashboard?.active_employees || 0}</span>
                    <span className="report-label">Active</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value text-danger">{stats?.dashboard?.inactive_employees || 0}</span>
                    <span className="report-label">Inactive</span>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <h3>System Summary</h3>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_roles || 0}</span>
                    <span className="report-label">Roles</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_permissions || 0}</span>
                    <span className="report-label">Permissions</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_departments || 0}</span>
                    <span className="report-label">Departments</span>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <h3>Activity Summary</h3>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_tasks || 0}</span>
                    <span className="report-label">Total Tasks</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.pending_leave_requests || 0}</span>
                    <span className="report-label">Pending Leaves</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-value">{stats?.dashboard?.total_attendance_records || 0}</span>
                    <span className="report-label">Attendance Records</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;
