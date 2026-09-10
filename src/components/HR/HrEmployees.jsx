import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HrSidebar from './HrSidebar';
import DefaultAvatar from '../Employee/DefaultAvatar';
import './HrDashboard.css';

const HrEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('Employees');
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    let result = employees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        (e.first_name + ' ' + e.last_name).toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.user_id?.toLowerCase().includes(q)
      );
    }
    if (departmentFilter) {
      result = result.filter(e => e.department_name === departmentFilter);
    }
    if (filter === 'active') {
      result = result.filter(e => e.tracker_status === 'active');
    } else if (filter === 'inactive') {
      result = result.filter(e => e.tracker_status === 'inactive');
    } else if (filter === 'present') {
      result = result.filter(e => e.attendance?.check_in);
    } else if (filter === 'absent') {
      result = result.filter(e => !e.attendance?.check_in);
    }
    setFiltered(result);
  }, [search, filter, departmentFilter, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/hr/employees.php`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data);
        setFiltered(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/department/fetctDepartment.php`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setDepartments(data.departments || []);
      }
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  const getStatusBadge = (emp) => {
    if (emp.tracker_status === 'active') {
      return <span className="badge bg-success">Active</span>;
    }
    return <span className="badge bg-danger">Inactive</span>;
  };

  const getAttendanceBadge = (emp) => {
    if (emp.attendance?.check_in) {
      return <span className="badge bg-success">Present {emp.attendance.is_late ? '(Late)' : ''}</span>;
    }
    return <span className="badge bg-secondary">Absent</span>;
  };

  const formatMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
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
          <div className="hr-filters mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <select 
              className="form-select mb-2 me-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ maxWidth: '150px', display: 'inline-block' }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
            <select 
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ maxWidth: '200px', display: 'inline-block' }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Attendance</th>
                    <th>Today's Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {emp.image ? (
                            <img src={`${BASE_URL}backend/api/assets/uploads/employee/${emp.image}`} alt="" className="rounded-circle me-2" width="36" height="36" />
                          ) : (
                            <DefaultAvatar gender={emp.gender} status={emp.status} size={36} />
                          )}
                          <div>
                            <div className="fw-semibold">{emp.first_name} {emp.last_name}</div>
                            <small className="text-muted">{emp.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{emp.user_id || `EMP${String(emp.id).padStart(4, '0')}`}</td>
                      <td>{emp.department_name || 'N/A'}</td>
                      <td>{emp.designation || 'N/A'}</td>
                      <td>{getStatusBadge(emp)}</td>
                      <td>{getAttendanceBadge(emp)}</td>
                      <td>{formatMinutes(emp.today_minutes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrEmployees;
