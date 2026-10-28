/**
 * STATIC USERS CONFIG
 * 
 * This file holds all static development users for testing login.
 * To add or change a user, edit the STATIC_USERS array below.
 * Each user needs:
 *   - accessKey: the username the user types (case-sensitive)
 *   - password: the password the user types
 *   - email: the user's email address
 *   - role: one of "admin", "employee", "hr", "manager"
 *   - redirectPath: the route the user is sent to after login
 */

export const STATIC_USERS = [
  {
    accessKey: "admin",
    password: "Admin@123",
    email: "john.admin@company.com",
    role: "admin",
    redirectPath: "/AdminDashboard",
  },
  {
    accessKey: "EMP0001",
    password: "Emp@0001",
    email: "anita.emp@company.com",
    role: "employee",
    redirectPath: "/EmployeeDashboard",
  },
  {
    accessKey: "hr0111",
    password: "Hr@0111",
    email: "priya.hr@company.com",
    role: "hr",
    redirectPath: "/hr/dashboard",
  },
  {
    accessKey: "manager001",
    password: "Mgr@001",
    email: "rahul.manager@company.com",
    role: "manager",
    redirectPath: "/manager/dashboard",
  },
];

// Helper: find a static user by exact access key (case-insensitive) AND exact password match (Option A)
export const findStaticUser = (accessKey, password) => {
  if (!accessKey || !password) return undefined;
  const key = accessKey.toLowerCase();
  return STATIC_USERS.find(
    (u) =>
      u.accessKey.toLowerCase() === key &&
      u.password === password
  );
};

// Helper: get all access keys for display in the login hint
export const getAccessKeysList = () => {
  return STATIC_USERS.map((u) => u.accessKey).join(", ");
};
