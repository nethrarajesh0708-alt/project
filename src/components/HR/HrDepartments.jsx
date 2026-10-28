import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockDepartments } from '../../mock/departments';
import './HrDashboard.css';

const HrDepartments = () => {
  const [activeTab, setActiveTab] = useState('Departments');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', head: '', description: '' });

  const handleSave = () => {
    if (editing) {
      // Mock edit
    } else {
      // Mock add
    }
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', head: '', description: '' });
  };

  const handleEdit = (dept) => {
    setEditing(dept);
    setForm(dept);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this department?')) {
      // Mock delete
    }
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Departments</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Department List</h5>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ name: '', head: '', description: '' }); setShowModal(true); }}>
              + Add Department
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Head</th>
                  <th>Employees</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDepartments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>{dept.head}</td>
                    <td>{dept.employeeCount}</td>
                    <td>{dept.description}</td>
                    <td>
                      <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleEdit(dept)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(dept.id)}>Delete</button>
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
                <h5 className="modal-title">{editing ? 'Edit Department' : 'Add Department'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Head</label>
                  <input type="text" className="form-control" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

export default HrDepartments;