import React, { useEffect, useState } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import {
  PeopleFill,
  FolderFill,
  GearFill,
  PersonPlusFill,
  PlusCircleFill,
  CalendarCheck,
  CashStack,
  Building,
  ListTask,
  PersonArmsUp,
} from "react-bootstrap-icons";
import axios from "axios";

const DashboardContent = ({ setShowEmployeeModal, setShowGroupModal, setActiveTab }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalGroups: 0,
    totalAttendance: 0,
    totalTasks: 0,
    totalPayroll: 0,
  });
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [empRes, deptRes, groupRes, attRes, taskRes, payrollRes] =
        await Promise.all([
          axios.get(`${BASE_URL}backend/api/employees/view.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}backend/api/department/fetctDepartment.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}backend/api/groups/view.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}backend/api/attendence/reports.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}backend/api/tasks/admin/list.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}backend/api/payroll/reports.php`, {
            withCredentials: true,
          }),
        ]);

      setStats({
        totalEmployees: empRes.data.success ? (empRes.data.employees?.length || 0) : 0,
        totalDepartments: deptRes.data.success
          ? deptRes.data.departments?.length || 0
          : 0,
        totalGroups: groupRes.data.success ? groupRes.data.groups?.length || 0 : 0,
        totalAttendance: attRes.data.success ? attRes.data.reports?.length || 0 : 0,
        totalTasks: taskRes.data.success ? taskRes.data.tasks?.length || 0 : 0,
        totalPayroll: payrollRes.data.success
          ? payrollRes.data.reports?.length || 0
          : 0,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <Card className="shadow-sm border-0 stat-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body className="d-flex align-items-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: color + "20",
            color: color,
          }}
        >
          <Icon size={28} />
        </div>
        <div>
          <p className="text-muted mb-0 small">{title}</p>
          <h3 className="mb-0 fw-bold">{loading ? "..." : value}</h3>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="dashboard-content">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={PeopleFill}
          color="#0d6efd"
          onClick={() => setActiveTab && setActiveTab("employees")}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building}
          color="#198754"
          onClick={() => setActiveTab && setActiveTab("departments")}
        />
        <StatCard
          title="Groups"
          value={stats.totalGroups}
          icon={FolderFill}
          color="#fd7e14"
          onClick={() => setActiveTab && setActiveTab("groups")}
        />
        <StatCard
          title="Attendance Records"
          value={stats.totalAttendance}
          icon={CalendarCheck}
          color="#20c997"
          onClick={() => setActiveTab && setActiveTab("attendance")}
        />
        <StatCard
          title="Tasks"
          value={stats.totalTasks}
          icon={ListTask}
          color="#6610f2"
          onClick={() => setActiveTab && setActiveTab("tasks")}
        />
        <StatCard
          title="Payroll Reports"
          value={stats.totalPayroll}
          icon={CashStack}
          color="#dc3545"
          onClick={() => setActiveTab && setActiveTab("payroll")}
        />
      </div>

      <div className="quick-actions-wrapper">
        <Card className="shadow-sm border-0">
          <Card.Body style={{ padding: 20 }}>
            <Card.Title>Quick Actions</Card.Title>
            <div className="quick-actions-grid">
              <Button
                variant="primary"
                className="d-flex align-items-center justify-content-between"
                onClick={() => setShowEmployeeModal(true)}
                style={{ height: 48 }}
              >
                <span>
                  <PersonPlusFill className="me-2" /> Register Employee
                </span>
              </Button>
              <Button
                variant="success"
                className="d-flex align-items-center justify-content-between"
                onClick={() => setShowGroupModal(true)}
                style={{ height: 48 }}
              >
                <span>
                  <PlusCircleFill className="me-2" /> Create Group
                </span>
              </Button>
              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-between"
                style={{ height: 48, borderRadius: 8 }}
                onClick={() => setActiveTab?.("tasks")}
              >
                <span>
                  <ListTask className="me-2" /> Tasks
                </span>
                <span className="badge bg-primary rounded-pill">Open</span>
              </Button>
              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-between"
                style={{ height: 48, borderRadius: 8 }}
                onClick={() => setActiveTab?.("taskList")}
              >
                <span>
                  <ListTask className="me-2" /> Task List
                </span>
                <span className="badge bg-primary rounded-pill">Open</span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
