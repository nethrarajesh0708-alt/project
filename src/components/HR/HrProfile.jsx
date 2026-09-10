import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState('HR Profile');
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/profile.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setForm(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch HR profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}backend/api/profile/profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, ...form });
        setEditing(false);
        alert('Profile updated successfully');
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) {
    return (
      <div className="hr-dashboard-layout">
        <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="hr-dashboard-main d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>HR Profile</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="card border-0 shadow-sm" style={{ maxWidth: '600px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Profile Information</h5>
                {!editing ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="username" value={form.username || ''} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={form.email || ''} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">HR ID</label>
                    <input type="text" className="form-control" value={form.user_id || ''} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={form.role?.toUpperCase() || 'HR'} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input type="text" className="form-control" value={form.status || 'active'} disabled />
                  </div>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </form>
              ) : (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Name</label>
                    <div className="fw-semibold">{profile?.username || 'N/A'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">HR ID</label>
                    <div className="fw-semibold">{profile?.user_id || 'N/A'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Email</label>
                    <div className="fw-semibold">{profile?.email || 'N/A'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Role</label>
                    <div className="fw-semibold">{profile?.role?.toUpperCase() || 'HR'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Status</label>
                    <div className="fw-semibold">{profile?.status || 'active'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Joined</label>
                    <div className="fw-semibold">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrProfile;
