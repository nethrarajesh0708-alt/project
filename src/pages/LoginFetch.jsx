import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogIn, FiKey, FiAlertCircle } from "react-icons/fi";

// TEMP DESIGN PHASE: login bypassed. Restore the original check before launch.
// Keyword -> route mapping. Edit keywords here.
// IMPORTANT: These match the exact routes in src/App.jsx
const KEYWORD_ROUTES = {
  admin: "/AdminDashboard",
  manager: "/manager/dashboard",
  hr: "/HrDashboard",
  emp: "/EmployeeDashboard",
};

// Comprehensive placeholder users per role so profile sections display fully.
const PLACEHOLDER_USERS = {
  admin: {
    id: "temp-admin",
    name: "John Admin",
    email: "john.admin@company.com",
    role: "Admin",
    employee_id: "ADMIN001",
    full_name: "John Admin",
    user_id: "ADMIN001",
    designation: "System Administrator",
    department: "Engineering",
    joinDate: "2018-03-01",
    status: "Active",
    permissions: ["Employees", "Attendance", "Payroll", "Reports", "Settings"],
    roleAssignedBy: "System",
    roleAssignedOn: "2018-03-01",
    username: "john.admin",
    lastLogin: { time: "2026-10-27 09:15 AM", ip: "192.168.1.105", device: "Chrome on Windows" },
    twoFactorEnabled: false,
    activeSessions: [],
    recentActions: [],
    loginHistory: [],
    preferences: { language: "English", timeZone: "Asia/Kolkata", notifications: true, theme: "light" },
    photo: "",
    phone: "9876543210",
    image: "",
    gender: "Male",
    address: "123 MG Road, Bangalore",
    emergency_contact: "9876543211",
    qualifications: "B.Tech Computer Science",
    skills: "Java, Spring Boot",
    photo_url: "",
    manager_id: null,
    leave_balance: 20,
    is_active: 1,
    created_at: "2018-03-01",
    work_location: "Bangalore",
    permanent_address: "123 MG Road, Bangalore",
    dob: "1985-05-15",
    bank_account_details: "Not provided",
    pan_number: "Not provided",
    pf_uan_number: "Not provided",
    employment_type: "full-time",
    assigned_manager_poc: "Not assigned",
    blood_group: "",
    date_of_birth: "1985-05-15",
  },
  manager: {
    id: "temp-manager",
    name: "Rahul Manager",
    email: "rahul.manager@company.com",
    role: "manager",
    employee_id: "EMPMGR001",
    full_name: "Rahul Manager",
    user_id: "EMPMGR001",
    designation: "Manager",
    department_name: "Engineering",
    phone: "9876543201",
    image: "",
    gender: "Male",
    status: "active",
    join_date: "2017-01-20",
    address: "456 Brigade Road, Bangalore",
    emergency_contact: "9876543202",
    qualifications: "MBA",
    skills: "Team Leadership, Project Management",
    photo_url: "",
    manager_id: null,
    leave_balance: 18,
    is_active: 1,
    created_at: "2017-01-20",
    work_location: "Bangalore",
    permanent_address: "456 Brigade Road, Bangalore",
    dob: "1982-11-10",
    bank_account_details: "Not provided",
    pan_number: "Not provided",
    pf_uan_number: "Not provided",
    employment_type: "full-time",
    assigned_manager_poc: "Not assigned",
    blood_group: "",
    date_of_birth: "1982-11-10",
  },
  hr: {
    id: "temp-hr",
    name: "Priya Hr",
    email: "priya.hr@company.com",
    role: "hr",
    employee_id: "HR0001",
    full_name: "Priya HR",
    user_id: "HR0001",
    designation: "HR Lead",
    department_name: "HR",
    phone: "9876543212",
    image: "",
    gender: "Female",
    status: "active",
    join_date: "2019-06-15",
    address: "456 Brigade Road, Bangalore",
    emergency_contact: "9876543213",
    qualifications: "MBA HR",
    skills: "Recruitment, Payroll",
    photo_url: "",
    manager_id: null,
    leave_balance: 18,
    is_active: 1,
    created_at: "2019-06-15",
    work_location: "Bangalore",
    permanent_address: "456 Brigade Road, Bangalore",
    dob: "1992-08-20",
    bank_account_details: "Not provided",
    pan_number: "Not provided",
    pf_uan_number: "Not provided",
    employment_type: "full-time",
    assigned_manager_poc: "Not assigned",
    blood_group: "",
    date_of_birth: "1992-08-20",
  },
  emp: {
    id: "temp-emp",
    name: "Ravi Kumar",
    email: "ravi.kumar@company.com",
    role: "employee",
    employee_id: "EMP0001",
    full_name: "Ravi Kumar",
    user_id: "EMP0001",
    designation: "Senior Developer",
    department_name: "Engineering",
    phone: "9876543210",
    image: "",
    gender: "Male",
    status: "active",
    join_date: "2018-03-01",
    address: "123 MG Road, Bangalore",
    emergency_contact: "9876543211",
    qualifications: "B.Tech Computer Science",
    skills: "Java, Spring Boot",
    photo_url: "",
    manager_id: 2,
    leave_balance: 12,
    is_active: 1,
    created_at: "2018-03-01",
    work_location: "Bangalore",
    permanent_address: "123 MG Road, Bangalore",
    dob: "1990-05-15",
    bank_account_details: "Not provided",
    pan_number: "Not provided",
    pf_uan_number: "Not provided",
    employment_type: "full-time",
    assigned_manager_poc: "Rahul Manager",
    blood_group: "",
    date_of_birth: "1990-05-15",
  },
};

// ORIGINAL LOGIN CODE (commented out - restore before launch):
// import * as Yup from "yup";
// import { useFormik } from "formik";

// const validationSchema = Yup.object().shape({
//   username: Yup.string().required("Access key is required"),
//   password: Yup.string().required("Please enter a password"),
// });
//
// const formik = useFormik({
//   initialValues: { username: "", password: "" },
//   validationSchema,
//   onSubmit: async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const response = await fetch(`${BASE_URL}backend/api/auth/login.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           username: formik.values.username,
//           password: formik.values.password,
//         }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         login({ username: formik.values.username, role: data.role });
//         navigate(
//           data.role === "admin" ? "/AdminDashboard"
//           : data.role === "hr" ? "/HrDashboard"
//           : data.role === "employee" ? "/EmployeeDashboard"
//           : "/"
//         );
//       } else {
//         setError(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   },
// });

const LoginFetch = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleEnter = (e) => {
    e.preventDefault();
    const key = document.querySelector('input[name="access-key"]').value.trim().toLowerCase();
    const target = KEYWORD_ROUTES[key];
    if (target) {
      setError("");
      // TEMP DESIGN PHASE: set placeholder user matching the keyword's role
      // before navigating so pages read the correct role and profile fields.
      const placeholder = PLACEHOLDER_USERS[key];
      if (placeholder) {
        login(placeholder);
      }
      navigate(target);
    } else {
      setError("Invalid access key");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card
        className="shadow-sm border-0"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <FiLogIn size={28} className="text-primary" />
            </div>
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted">Enter your access key to continue</p>
          </div>

          {error && (
            <Alert variant="danger" className="d-flex align-items-center mb-3">
              <FiAlertCircle className="me-2" size={18} />
              {error}
            </Alert>
          )}

          <Form onSubmit={handleEnter}>
            <Form.Group className="mb-4">
              <Form.Label className="text-muted small fw-bold">
                ACCESS KEY
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiKey className="text-muted" />
                </span>
                <input
                  type="text"
                  name="access-key"
                  className="form-control border-start-0"
                  placeholder="Enter access key"
                  autoFocus
                />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2 fw-bold"
            >
              <>
                <FiKey className="me-2" />
                Enter
              </>
            </Button>
          </Form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Try: <strong>admin</strong>, <strong>manager</strong>, <strong>hr</strong>, <strong>emp</strong>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginFetch;
