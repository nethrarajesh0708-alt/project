import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockHolidays } from '../../mock/holidays';
import './HrDashboard.css';

const HrHolidays = () => {
  const [activeTab, setActiveTab] = useState('Holidays');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', type: 'National' });

  const handleSave = () => {
    setShowModal(false);
    setForm({ name: '', date: '', type: 'National' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this holiday?')) {
      // Mock delete
    }
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Holidays</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Holiday List</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Holiday</button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockHolidays.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.name}</td>
                    <td>{h.date}</td>
                    <td><span className="badge bg-info">{h.type}</span></td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(h.id)}>Delete</button>
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Holiday</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="National">National</option>
                    <option value="Company">Company</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrHolidays;