import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdmin.css";

const SuperAdminSettings = () => {
  const [settings, setSettings] = useState({
    site_name: "Desk.in",
    support_email: "support@deskin.com",
    max_login_attempts: 5,
    session_timeout: 30,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Settings");

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="super-admin-main">
        <header className="super-admin-header">
          <div>
            <h1>Settings</h1>
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
          <div className="settings-card">
            <h3>System Settings</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Site Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Support Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Max Login Attempts</label>
                <input
                  type="number"
                  className="form-control"
                  name="max_login_attempts"
                  value={settings.max_login_attempts}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  name="session_timeout"
                  value={settings.session_timeout}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
