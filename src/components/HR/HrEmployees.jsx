import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HrSidebar from './HrSidebar';
import { mockEmployees } from '../../mock/employees';
import { mockDepartments } from '../../mock/departments';
import './HrDashboard.css';

const HrEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [activeTab, setActiveTab] = useState('Employees');
  const navigate = useNavigate();

  useEffect(() => {
    setEmployees(mockEmployees);
    setFiltered(mockEmployees);
  }, []);

  useEffect(() => {
    let result = employees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    if (departmentFilter) {
      result = result.filter(e => e.department === departmentFilter);
    }
    setFiltered(result);
  }, [search, departmentFilter, employees]);

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? <span className="badge bg-success">Active</span>
      : <span className="badge bg-secondary">Inactive</span>;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Employee Management</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, ID, or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">All Departments</option>
              {mockDepartments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <div className="fw-semibold">{emp.name}</div>
                          <small className="text-muted">{emp.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{getStatusBadge(emp.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrEmployees;