import React, { useState, useEffect } from "react";
import { Nav, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  GearFill,
  PeopleFill,
  FolderFill,
  HouseFill,
  CashStack,
  Building,
  ListTask,
  ArrowRightShort,
  ArrowLeftShort,
  CalendarCheck,
  CalendarEvent,
  CalendarWeek,
  PersonGear,
  ShieldLock,
  JournalCheck,
} from "react-bootstrap-icons";
import axios from "axios";
import "../../assets/css/Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    groups: 0,
    attendance: 0,
  });

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [empRes, deptRes, groupRes, attRes] = await Promise.all([
        axios.get(`${BASE_URL}backend/api/employees/view.php`, { withCredentials: true }),
        axios.get(`${BASE_URL}backend/api/department/fetctDepartment.php`, { withCredentials: true }),
        axios.get(`${BASE_URL}backend/api/groups/view.php`, { withCredentials: true }),
        axios.get(`${BASE_URL}backend/api/attendence/reports.php`, { withCredentials: true }),
      ]);

      setStats({
        employees: empRes.data.success ? empRes.data.employees?.length || 0 : 0,
        departments: deptRes.data.success ? deptRes.data.departments?.length || 0 : 0,
        groups: groupRes.data.success ? groupRes.data.groups?.length || 0 : 0,
        attendance: attRes.data.success ? attRes.data.reports?.length || 0 : 0,
      });
    } catch (err) {
      console.error("Failed to load sidebar stats:", err);
    }
  };

  const navItems = [
    { id: "dashboard", icon: HouseFill, label: "Dashboard" },
    { id: "employees", icon: PeopleFill, label: "Employees", badge: stats.employees },
    { id: "groups", icon: FolderFill, label: "Groups", badge: stats.groups },
    { id: "departments", icon: Building, label: "Departments", badge: stats.departments },
    { id: "attendance", icon: CalendarCheck, label: "Attendance", badge: stats.attendance },
    { id: "leave", icon: JournalCheck, label: "Leave" },
    { id: "payroll", icon: CashStack, label: "Payroll" },
    { id: "holidays", icon: CalendarEvent, label: "Holidays" },
    { id: "profile", icon: PersonGear, label: "Profile" },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderTooltip = (label) => (
    <Tooltip id={`tooltip-${label}`}>{label}</Tooltip>
  );

  return (
    <Col
      md={collapsed ? 1 : 3}
      lg={collapsed ? 1 : 2}
      className={`sidebar px-0 ${collapsed ? "collapsed" : ""}`}
    >
      <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
        {!collapsed && <h4 className="text-white mb-0">Desk.in Admin</h4>}
        <button
          onClick={toggleSidebar}
          className="toggle-btn bg-transparent border-0 text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ArrowRightShort size={20} />
          ) : (
            <ArrowLeftShort size={20} />
          )}
        </button>
      </div>

      <Nav variant="pills" className="flex-column">
        {navItems.map((item) => (
          <Nav.Item key={item.id}>
            <OverlayTrigger
              placement="right"
              overlay={renderTooltip(item.label)}
              show={collapsed && hoveredItem === item.id ? true : false}
            >
              <Nav.Link
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className="d-flex align-items-center"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="nav-item-label">
                  <item.icon className={`nav-item-icon ${collapsed ? "mx-auto" : ""}`} />
                  {!collapsed && item.label}
                </span>
                {!collapsed && item.badge !== undefined && (
                  <span className="badge bg-primary rounded-pill nav-item-badge">
                    {item.badge}
                  </span>
                )}
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
        ))}
      </Nav>
    </Col>
  );
};

export default Sidebar;
