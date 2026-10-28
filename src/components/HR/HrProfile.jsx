import React, { useState, useEffect } from 'react';
import HrSidebar from './HrSidebar';
import { useAuth } from '../../context/AuthContext';
import PageErrorBoundary from '../../components/common/ErrorBoundary';
import { api } from '../../api';
import './HrDashboard.css';

const HrProfile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState('HR Profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const empId = user?.employee_id || user?.id || '';
    if (!empId) {
      setLoading(false);
      return;
    }
    api.getEmployee(empId)
      .then(({ data, error: err }) => {
        setError(err || null);
        setProfile(data || null);
      })
      .catch((e) => {
        setError(e.message || 'Failed to load profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.employee_id, user?.id]);

  const displayProfile = profile || {
    username: user?.email ? user.email.split('@')[0].replace('.', ' ') : 'HR User',
    email: user?.email || '',
    user_id: user?.employee_id || '',
    role: user?.role || 'hr',
    status: 'active',
    created_at: '',
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated (mock - no backend)');
    setEditing(false);
  };

  if (loading) {
    return (
      <PageErrorBoundary>
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
              <div className="text-center" style={{ padding: '4rem 0' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  if (error && !profile) {
    return (
      <PageErrorBoundary>
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
              <div className="text-center" style={{ padding: '4rem 0' }}>
                <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <h4>Could not load profile</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>Retry</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary>
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
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditing(true); setForm(displayProfile); }}>Edit Profile</button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setForm(displayProfile); }}>Cancel</button>
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
                      <input type="text" className="form-control" value={displayProfile.user_id} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <input type="text" className="form-control" value="HR" disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <input type="text" className="form-control" value="Active" disabled />
                    </div>
                    <button type="submit" className="btn btn-success">Save Changes</button>
                  </form>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted">Name</label>
                      <div className="fw-semibold">{displayProfile.username}</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">HR ID</label>
                      <div className="fw-semibold">{displayProfile.user_id}</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Email</label>
                      <div className="fw-semibold">{displayProfile.email}</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Role</label>
                      <div className="fw-semibold">HR</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Status</label>
                      <div className="fw-semibold">Active</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Joined</label>
                      <div className="fw-semibold">{displayProfile.created_at ? new Date(displayProfile.created_at).toLocaleDateString() : '-'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default HrProfile;
