import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import { mockPayroll } from '../../mock/payroll';
import './HrDashboard.css';

const HrPayroll = () => {
  const [activeTab, setActiveTab] = useState('Payroll');
  const [month, setMonth] = useState('July 2025');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = mockPayroll.filter(p => p.month === month);

  const totalPayout = filtered.reduce((sum, p) => sum + p.net, 0);
  const totalDeductions = filtered.reduce((sum, p) => sum + p.deductions, 0);
  const paid = filtered.filter(p => p.status === 'Paid').length;
  const pending = filtered.filter(p => p.status === 'Pending').length;

  const viewPayslip = (p) => { setSelected(p); setShowModal(true); };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Payroll Management</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="mb-3">
            <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)} style={{ maxWidth: '150px' }}>
              <option value="July 2025">July 2025</option>
              <option value="June 2025">June 2025</option>
            </select>
          </div>

          <div className="hr-cards-grid mb-4">
            <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
              <div className="hr-card-icon">💰</div>
              <div className="hr-card-info"><h3>₹{totalPayout.toLocaleString()}</h3><p>Total Payout</p></div>
            </div>
            <div className="hr-stat-card" style={{ '--card-color': '#dc2626' }}>
              <div className="hr-card-icon">📋</div>
              <div className="hr-card-info"><h3>₹{totalDeductions.toLocaleString()}</h3><p>Total Deductions</p></div>
            </div>
            <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
              <div className="hr-card-icon">✅</div>
              <div className="hr-card-info"><h3>{paid}</h3><p>Paid</p></div>
            </div>
            <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
              <div className="hr-card-icon">⏳</div>
              <div className="hr-card-info"><h3>{pending}</h3><p>Pending</p></div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.employeeName} ({p.employeeId})</td>
                    <td>₹{p.basic.toLocaleString()}</td>
                    <td>₹{p.allowances.toLocaleString()}</td>
                    <td>₹{p.deductions.toLocaleString()}</td>
                    <td>₹{p.net.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => viewPayslip(p)}>
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selected && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payslip - {selected.month}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Employee:</strong> {selected.employeeName} ({selected.employeeId})</p>
                <table className="table">
                  <tbody>
                    <tr><td>Basic Salary</td><td>₹{selected.basic.toLocaleString()}</td></tr>
                    <tr><td>HRA</td><td>₹{selected.hra.toLocaleString()}</td></tr>
                    <tr><td>Allowances</td><td>₹{selected.allowances.toLocaleString()}</td></tr>
                    <tr><td>Deductions</td><td>₹{selected.deductions.toLocaleString()}</td></tr>
                    <tr><td><strong>Net Pay</strong></td><td><strong>₹{selected.net.toLocaleString()}</strong></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-primary">Download (Mock)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrPayroll;