import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockAnnouncements } from '../../mock/announcements';
import './HrDashboard.css';

const HrAnnouncements = () => {
  const [activeTab, setActiveTab] = useState('Announcements');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', audience: 'All', date: '' });

  const handleSave = () => {
    setShowModal(false);
    setForm({ title: '', message: '', audience: 'All', date: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this announcement?')) {
      // Mock delete
    }
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Announcements</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Notice Board</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Announcement</button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Audience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAnnouncements.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>
                      <strong>{a.title}</strong>
                      <br />
                      <small className="text-muted">{a.message}</small>
                    </td>
                    <td>{a.date}</td>
                    <td><span className="badge bg-secondary">{a.audience}</span></td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Announcement</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Audience</label>
                      <select className="form-select" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                        <option value="All">All</option>
                        <option value="Employees">Employees</option>
                        <option value="Managers">Managers</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrAnnouncements;