import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ManagerSidebar from './ManagerSidebar';
import './ManagerDashboard.css';

const ManagerProfile = () => {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/profile`, { credentials: 'include' });
      if (res.status === 401) throw new Error('Session expired. Please log in again.');
      if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load profile');
      setProfile(data.user);
      setDraft(data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
const { employee_id, role, department_id, designation, ...payload } = draft;
      void employee_id; void role; void department_id; void designation;
      const res = await fetch(`${BASE_URL}/backend/api/manager/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save profile');
      }
      setProfile(data.user);
      setDraft(data.user);
      await updateUser?.({ name: data.user.name, email: data.user.email, photo_url: data.user.photo_url });
      setSuccess('Profile saved successfully');
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    setPwSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/backend/api/manager/change_password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Password change failed');
      setPwSuccess(data.message || 'Password changed successfully');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Photo must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => handleChange('photo_url', reader.result);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="manager-dashboard-layout">
        <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="manager-dashboard-main">
          <div className="text-center mt-5"><Spinner animation="border" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard-layout">
      <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="manager-dashboard-main">
        <header className="manager-dashboard-header">
          <div>
            <h1>My Profile</h1>
          </div>
        </header>
        <div className="manager-section" style={{ padding: '1.5rem' }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="employee-avatar mx-auto mb-3" style={{ width: 120, height: 120, overflow: 'hidden' }}>
                    {profile?.photo_url
                      ? <img src={profile.photo_url} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 36 }}>{(profile?.name || 'M').charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  {editing && (
                    <>
                      <Form.Control type="file" accept="image/*" onChange={handlePhotoUpload} size="sm" />
                      <small className="text-muted">Max 2MB</small>
                    </>
                  )}
                </Col>
                <Col md={9}>
                  {editing ? (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control value={draft.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select value={draft.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}>
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" value={draft.dob || ''} onChange={(e) => handleChange('dob', e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Personal Phone</Form.Label>
                            <Form.Control value={draft.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Personal Email</Form.Label>
                            <Form.Control type="email" value={draft.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Work Location</Form.Label>
                            <Form.Control value={draft.work_location || ''} onChange={(e) => handleChange('work_location', e.target.value)} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Address</Form.Label>
                        <Form.Control value={draft.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Permanent Address</Form.Label>
                        <Form.Control value={draft.permanent_address || ''} onChange={(e) => handleChange('permanent_address', e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Emergency Contact</Form.Label>
                        <Form.Control value={draft.emergency_contact || ''} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Qualifications</Form.Label>
                        <Form.Control value={draft.qualifications || ''} onChange={(e) => handleChange('qualifications', e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Skills</Form.Label>
                        <Form.Control value={draft.skills || ''} onChange={(e) => handleChange('skills', e.target.value)} />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button onClick={handleSave} disabled={saving} variant="primary">
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button onClick={() => { setEditing(false); setDraft(profile); }} variant="secondary">
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div>
                      <h5>{profile?.name}</h5>
                      <p className="text-muted">{profile?.designation} · {profile?.employee_id}</p>
                      <p><strong>Email:</strong> {profile?.email}</p>
                      <p><strong>Phone:</strong> {profile?.phone || '--'}</p>
                      <p><strong>DOB:</strong> {profile?.dob || '--'}</p>
                      <p><strong>Gender:</strong> {profile?.gender || '--'}</p>
                      <p><strong>Address:</strong> {profile?.address || '--'}</p>
                      <p><strong>Permanent Address:</strong> {profile?.permanent_address || '--'}</p>
                      <p><strong>Emergency Contact:</strong> {profile?.emergency_contact || '--'}</p>
                      <p><strong>Work Location:</strong> {profile?.work_location || '--'}</p>
                      <p><strong>Qualifications:</strong> {profile?.qualifications || '--'}</p>
                      <p><strong>Skills:</strong> {profile?.skills || '--'}</p>
                      <p><strong>Department:</strong> {profile?.department_id} (read-only)</p>
                      <p><strong>Role:</strong> {profile?.role} (read-only)</p>
                      <p><strong>Employee ID:</strong> {profile?.employee_id} (read-only)</p>
                      <p><strong>Joining Date:</strong> {profile?.joining_date || '--'}</p>
                      <p><strong>Leave Balance:</strong> {profile?.leave_balance}</p>
                      <Button onClick={() => setEditing(true)} variant="primary" className="mt-3">Edit Profile</Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="mb-3">Change Password</h5>
              {pwError && <Alert variant="danger">{pwError}</Alert>}
              {pwSuccess && <Alert variant="success">{pwSuccess}</Alert>}
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} required />
                </Form.Group>
                <Button type="submit" disabled={pwSubmitting}>{pwSubmitting ? 'Changing...' : 'Change Password'}</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
