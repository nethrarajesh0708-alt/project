import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { useAuth } from '../../context/AuthContext';
import './HrDashboard.css';

const HrSettings = () => {
  const [activeTab, setActiveTab] = useState('Settings');
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Password changed (mock)');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Settings</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0 fw-bold">Change Password</div>
                <div className="card-body">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" name="current" value={passwordForm.current} onChange={handlePasswordChange} />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input type="password" className="form-control" name="new" value={passwordForm.new} onChange={handlePasswordChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <input type="password" className="form-control" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Update Password</button>
                  </form>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 fw-bold">Notification Preferences</div>
                <div className="card-body">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-capitalize">{key} Notifications</span>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" checked={value} onChange={() => handleToggle(key)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 fw-bold">HR Profile</div>
                <div className="card-body text-center">
                  <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    HR
                  </div>
                  <h6 className="mb-1">{user?.email || 'priya.hr@company.com'}</h6>
                  <span className="badge bg-primary mb-3">HR</span>
                  <p className="text-muted small mb-0">HR ID: HR0111</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrSettings;