import React, { useState } from 'react';
import HrSidebar from './HrSidebar';
import './HrDashboard.css';

const HrRecruitment = () => {
  const [activeTab, setActiveTab] = useState('Recruitment');
  const [subTab, setSubTab] = useState('openings');
  const [stageFilter, setStageFilter] = useState('Applied');

  const openings = [
    { id: 1, title: 'Senior Developer', department: 'Engineering', positions: 2, status: 'Open' },
    { id: 2, title: 'HR Executive', department: 'HR', positions: 1, status: 'Open' },
    { id: 3, title: 'Sales Manager', department: 'Sales', positions: 1, status: 'Filled' },
  ];

  const candidates = [
    { id: 1, name: 'Amit Verma', role: 'Senior Developer', stage: 'Applied' },
    { id: 2, name: 'Sneha Rao', role: 'HR Executive', stage: 'Interview' },
    { id: 3, name: 'Vijay Singh', role: 'Sales Manager', stage: 'Offered' },
    { id: 4, name: 'Pooja Nair', role: 'Senior Developer', stage: 'Rejected' },
  ];

  const filteredCandidates = stageFilter === 'All' ? candidates : candidates.filter(c => c.stage === stageFilter);

  const getStageBadge = (stage) => {
    const map = {
      Applied: 'bg-secondary',
      Interview: 'bg-primary',
      Offered: 'bg-success',
      Rejected: 'bg-danger',
    };
    return <span className={`badge ${map[stage] || 'bg-secondary'}`}>{stage}</span>;
  };

  return (
    <div className="hr-dashboard-layout">
      <HrSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="hr-dashboard-main">
        <header className="hr-dashboard-header">
          <div>
            <h1>Recruitment</h1>
            <p className="hr-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </header>

        <div className="hr-dashboard-content">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className={`nav-link ${subTab === 'openings' ? 'active' : ''}`} onClick={() => setSubTab('openings')}>Job Openings</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${subTab === 'candidates' ? 'active' : ''}`} onClick={() => setSubTab('candidates')}>Candidates</button>
            </li>
          </ul>

          {subTab === 'openings' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Positions</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openings.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.title}</td>
                      <td>{o.department}</td>
                      <td>{o.positions}</td>
                      <td><span className={`badge ${o.status === 'Open' ? 'bg-success' : 'bg-secondary'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="mb-3 d-flex gap-2 align-items-center">
                <span className="text-muted small">Filter by stage:</span>
                {['All', 'Applied', 'Interview', 'Offered', 'Rejected'].map((s) => (
                  <button key={s} className={`btn btn-sm ${stageFilter === s ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setStageFilter(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role Applied</th>
                      <th>Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.role}</td>
                        <td>{getStageBadge(c.stage)}</td>
                        <td>
                          <select className="form-select form-select-sm" value={c.stage} style={{ width: 'auto' }} onChange={() => {}}>
                            <option>Applied</option>
                            <option>Interview</option>
                            <option>Offered</option>
                            <option>Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrRecruitment;