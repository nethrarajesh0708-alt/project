import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import HrSidebar from './HrSidebar';
import PageErrorBoundary from '../../components/common/ErrorBoundary';
import { api } from '../../api';
import './HrDashboard.css';

const STATUS_BADGE_MAP = {
  Present: 'bg-success',
  Absent: 'bg-danger',
  Late: 'bg-warning',
  'Half-day': 'bg-info',
  'On Leave': 'bg-secondary',
};

const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Finance'];

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Half-day', 'On Leave'];

const AttendanceDetail = ({ record, onClose }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!record?.employeeId) {
      setLoading(false);
      return;
    }
    api.getEmployeeAttendance(record.employeeId)
      .then(({ data, error: err }) => {
        setError(err || null);
        setMonthlyData(data || []);
      })
      .catch((e) => {
        setError(e.message || 'Failed to load attendance details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [record?.employeeId]);

  const summary = {
    present: (monthlyData || []).filter(d => d.status === 'Present').length,
    absent: (monthlyData || []).filter(d => d.status === 'Absent').length,
    late: (monthlyData || []).filter(d => d.status === 'Late').length,
    leave: (monthlyData || []).filter(d => d.status === 'On Leave' || d.status === 'Half-day').length,
  };

  const panelStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 2000, padding: '1rem',
  };

  const cardStyle = {
    background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px',
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    padding: '1.5rem',
  };

  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Loading attendance details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={panelStyle}>
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>Error loading details</h2>
          <p style={{ color: '#64748b' }}>{error}</p>
          <button onClick={onClose} className="btn btn-primary mt-3">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, color: '#0f172a' }}>{record?.employeeName || 'Employee'} - Attendance Details</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 500 }}
          >
            Close
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          {[['Present', summary.present, '#16a34a'], ['Absent', summary.absent, '#dc2626'], ['Late', summary.late, '#d97706'], ['Leave', summary.leave, '#64748b']].map(([label, value, color]) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
            Monthly Attendance ({record?.department || ''})
          </label>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontSize: '0.85rem', borderBottom: '2px solid #e2e8f0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontSize: '0.85rem', borderBottom: '2px solid #e2e8f0' }}>Check-in</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontSize: '0.85rem', borderBottom: '2px solid #e2e8f0' }}>Check-out</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontSize: '0.85rem', borderBottom: '2px solid #e2e8f0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(monthlyData || []).map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>{d?.date || ''}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>{d?.checkIn || ''}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>{d?.checkOut || ''}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                    <span className={`badge ${STATUS_BADGE_MAP[d?.status] || 'bg-secondary'}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                      {d?.status || ''}
                    </span>
                  </td>
                </tr>
              ))}
              {(monthlyData || []).length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '1rem', color: '#64748b', textAlign: 'center' }}>No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const HrAttendance = () => {
  const [activeTab, setActiveTab] = useState('Attendance');
  const [regTab, setRegTab] = useState('records');
  const [filters, setFilters] = useState({ search: '', date: '', department: '', status: '', page: 1 });
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);
  const { user } = useAuth();
  const safeUser = user || {};

  const ROWS_PER_PAGE = 5;
  const isEmployee = safeUser.role === 'employee';

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageNum = isEmployee ? 1 : filters.page;
      const { data, error: err, total: totalCount } = await api.getAttendance({
        date: filters.date || undefined,
        department: filters.department || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
        page: pageNum,
      });
      setError(err || null);
      if (isEmployee) {
        const own = (data || []).filter(r => r.employeeId === (safeUser.employee_id || ''));
        setRecords(own);
        setTotal(own.length);
      } else {
        setRecords(data || []);
        setTotal(totalCount || 0);
      }
    } catch (e) {
      setError(e.message || 'Failed to load attendance records');
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, isEmployee, safeUser.employee_id]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleDateChange = (e) => {
    setFilters({ ...filters, date: e.target.value, page: 1 });
  };

  const handleDeptChange = (e) => {
    setFilters({ ...filters, department: e.target.value, page: 1 });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleExport = () => {
    // Export placeholder - no backend yet
  };

  const handleViewDetails = (record) => {
    setDetailRecord(record);
  };

  const getStatusBadge = (status) => {
    const map = {
      Present: 'bg-success',
      Absent: 'bg-danger',
      Late: 'bg-warning',
      'Half-day': 'bg-info',
      'On Leave': 'bg-secondary',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const displayRecords = isEmployee ? records.slice(0, ROWS_PER_PAGE) : records;

  return (
    <PageErrorBoundary>
      <div className="hr-dashboard-layout">
        <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="hr-dashboard-main">
          <header className="hr-dashboard-header">
            <div>
              <h1>Attendance Overview</h1>
              <p className="hr-datetime">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            {detailRecord && <AttendanceDetail record={detailRecord} onClose={() => setDetailRecord(null)} />}
          </header>

          <div className="hr-dashboard-content">
            {loading ? (
              <div className="text-center" style={{ padding: '4rem 0' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading attendance records...</p>
              </div>
            ) : error ? (
              <div className="text-center" style={{ padding: '4rem 0' }}>
                <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <h4>Could not load data</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary mt-3" onClick={loadRecords}>Retry</button>
                </div>
              </div>
            ) : null}

            {!loading && !error && (
              <>
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button className={`nav-link ${regTab === 'records' ? 'active' : ''}`} onClick={() => setRegTab('records')}>Records</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${regTab === 'regularization' ? 'active' : ''}`} onClick={() => setRegTab('regularization')}>Regularization Requests</button>
                  </li>
                </ul>

                {regTab === 'records' && (
                  <>
                    <div className="hr-cards-grid mb-4">
                      <div className="hr-stat-card" style={{ '--card-color': '#2563eb' }}>
                        <div className="hr-card-icon">📅</div>
                        <div className="hr-card-info"><h3>{total}</h3><p>Total Records</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#16a34a' }}>
                        <div className="hr-card-icon">✅</div>
                        <div className="hr-card-info"><h3>{(records || []).filter(r => r.status === 'Present').length}</h3><p>Present</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#dc2626' }}>
                        <div className="hr-card-icon">❌</div>
                        <div className="hr-card-info"><h3>{(records || []).filter(r => r.status === 'Absent').length}</h3><p>Absent</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#d97706' }}>
                        <div className="hr-card-icon">⏰</div>
                        <div className="hr-card-info"><h3>{(records || []).filter(r => r.status === 'Late').length}</h3><p>Late</p></div>
                      </div>
                      <div className="hr-stat-card" style={{ '--card-color': '#64748b' }}>
                        <div className="hr-card-icon">🏖️</div>
                        <div className="hr-card-info"><h3>{(records || []).filter(r => r.status === 'Half-day' || r.status === 'On Leave').length}</h3><p>Half-day / Leave</p></div>
                      </div>
                    </div>

                    {!isEmployee && (
                      <div className="d-flex flex-wrap gap-2 mb-4 align-items-end" style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ minWidth: '220px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Search by Name or ID</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={filters.search}
                            onChange={handleSearch}
                            placeholder="Search..."
                          />
                        </div>
                        <div style={{ minWidth: '160px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={filters.date}
                            onChange={handleDateChange}
                          />
                        </div>
                        <div style={{ minWidth: '180px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Department</label>
                          <select className="form-select form-select-sm" value={filters.department} onChange={handleDeptChange}>
                            <option value="">All Departments</option>
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ minWidth: '160px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Status</label>
                          <select className="form-select form-select-sm" value={filters.status} onChange={handleStatusChange}>
                            <option value="">All Status</option>
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ minWidth: 'auto' }}>
                          <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>Export</button>
                        </div>
                      </div>
                    )}

                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Date</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Total Hours</th>
                            <th>Status</th>
                            {!isEmployee && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {(records || []).length === 0 ? (
                            <tr>
                              <td colSpan={isEmployee ? 8 : 9} className="text-center text-muted py-4">No records found.</td>
                            </tr>
                          ) : (
                            displayRecords.map((r) => (
                              <tr key={r.id}>
                                <td>{r.employeeId}</td>
                                <td>{r.employeeName}</td>
                                <td>{r.department}</td>
                                <td>{r.date}</td>
                                <td>{r.checkIn}</td>
                                <td>{r.checkOut}</td>
                                <td>{r.totalHours}</td>
                                <td>{getStatusBadge(r.status)}</td>
                                {!isEmployee && (
                                  <td>
                                    <button
                                      className="btn btn-outline-info btn-sm me-1"
                                      onClick={() => handleViewDetails(r)}
                                    >
                                      View details
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {!isEmployee && totalPages > 1 && (
                      <nav className="mt-3">
                        <ul className="pagination justify-content-center mb-0">
                          <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(filters.page - 1); }}>Previous</a>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${i + 1 === filters.page ? 'active' : ''}`}>
                              <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>{i + 1}</a>
                            </li>
                          ))}
                          <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(filters.page + 1); }}>Next</a>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}

                {regTab === 'regularization' && (
                  <div className="text-center py-5">
                    <p className="text-muted">No regularization requests pending.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default HrAttendance;
