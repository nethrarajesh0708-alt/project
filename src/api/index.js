// TEMP DESIGN PHASE: API layer. Set USE_DUMMY_DATA=true to use fallback data.
// Backend routes not yet built for all functions; failures return safe defaults.

// Config
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

// Field mapper: API field names -> UI field names. Edit here if backend changes.
const mapEmployee = (raw) => ({
  id: raw.id ?? raw.employee_id ?? raw.user_id ?? '',
  name: raw.name ?? raw.full_name ?? raw.employeeName ?? '',
  email: raw.email ?? '',
  phone: raw.phone ?? raw.mobile ?? raw.mobile_number ?? '',
  department: raw.department ?? raw.department_name ?? '',
  role: raw.role ?? '',
  photo: raw.photo ?? raw.photo_url ?? raw.image ?? '',
  joinDate: raw.join_date ?? raw.joining_date ?? raw.created_at ?? '',
});

const mapAttendance = (raw) => ({
  id: raw.id ?? '',
  employeeId: raw.employeeId ?? raw.employee_id ?? raw.user_id ?? '',
  employeeName: raw.employeeName ?? raw.full_name ?? raw.name ?? '',
  department: raw.department ?? raw.department_name ?? '',
  date: raw.date ?? '',
  checkIn: raw.checkIn ?? raw.check_in ?? '',
  checkOut: raw.checkOut ?? raw.check_out ?? '',
  totalHours: raw.totalHours ?? raw.total_hours ?? raw.hours ?? 0,
  status: raw.status ?? 'Present',
});

const mapProfile = (raw) => ({
  id: raw.id ?? raw.employee_id ?? raw.user_id ?? '',
  employeeId: raw.employeeId ?? raw.employee_id ?? raw.user_id ?? '',
  fullName: raw.full_name ?? raw.name ?? raw.employeeName ?? '',
  name: raw.name ?? raw.full_name ?? raw.employeeName ?? '',
  email: raw.email ?? '',
  phone: raw.phone ?? raw.mobile ?? raw.mobile_number ?? '',
  photo: raw.photo ?? raw.photo_url ?? raw.image ?? '',
  image: raw.image ?? raw.photo ?? raw.photo_url ?? '',
  designation: raw.designation ?? '',
  department: raw.department ?? raw.department_name ?? '',
  department_name: raw.department_name ?? raw.department ?? '',
  joinDate: raw.join_date ?? raw.joining_date ?? raw.created_at ?? '',
  join_date: raw.join_date ?? raw.joining_date ?? raw.created_at ?? '',
  role: raw.role ?? '',
  status: raw.status ?? '',
  permissions: raw.permissions ?? [],
  roleAssignedBy: raw.roleAssignedBy ?? '',
  roleAssignedOn: raw.roleAssignedOn ?? '',
  username: raw.username ?? '',
  lastLogin: raw.lastLogin ?? { time: '-', ip: '-', device: '-' },
  twoFactorEnabled: raw.twoFactorEnabled ?? false,
  activeSessions: raw.activeSessions ?? [],
  recentActions: raw.recentActions ?? [],
  loginHistory: raw.loginHistory ?? [],
  preferences: raw.preferences ?? { language: 'English', timeZone: 'Asia/Kolkata', notifications: true, theme: 'light' },
  gender: raw.gender ?? '',
  address: raw.address ?? '',
  emergency_name: raw.emergency_name ?? '',
  emergency_phone: raw.emergency_phone ?? '',
  emergency_relation: raw.emergency_relation ?? '',
  date_of_birth: raw.date_of_birth ?? '',
  blood_group: raw.blood_group ?? '',
  employment_type: raw.employment_type ?? '',
  bank_account_details: raw.bank_account_details ?? '',
  pan_number: raw.pan_number ?? '',
  pf_uan_number: raw.pf_uan_number ?? '',
  assigned_manager_poc: raw.assigned_manager_poc ?? '',
  qualifications: raw.qualifications ?? '',
  skills: raw.skills ?? '',
  photo_url: raw.photo_url ?? raw.photo ?? raw.image ?? '',
  manager_id: raw.manager_id ?? null,
  leave_balance: raw.leave_balance ?? 0,
  is_active: raw.is_active ?? 1,
  created_at: raw.created_at ?? '',
  work_location: raw.work_location ?? '',
  permanent_address: raw.permanent_address ?? '',
  dob: raw.dob ?? '',
});

// Safe fetch wrapper: returns { data, error }
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}` };
    }
    const json = await res.json();
    return { data: json, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// Dummy fallback data
const dummyEmployees = [
  { id: 'EMP0001', name: 'Ravi Kumar', email: 'ravi.kumar@company.com', phone: '9876543210', department: 'Engineering', role: 'employee', photo: '', joinDate: '2018-03-01' },
  { id: 'EMP0002', name: 'Anita Patel', email: 'anita.patel@company.com', phone: '9876543211', department: 'HR', role: 'employee', photo: '', joinDate: '2019-05-15' },
  { id: 'EMP0003', name: 'Rohan Mehta', email: 'rohan.mehta@company.com', phone: '9876543212', department: 'Sales', role: 'employee', photo: '', joinDate: '2020-01-10' },
  { id: 'EMP0004', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '9876543213', department: 'Finance', role: 'employee', photo: '', joinDate: '2020-08-20' },
  { id: 'EMP0005', name: 'Kiran Das', email: 'kiran.das@company.com', phone: '9876543214', department: 'Engineering', role: 'employee', photo: '', joinDate: '2021-02-05' },
  { id: 'EMPMGR001', name: 'Rahul Manager', email: 'rahul.manager@company.com', phone: '9876543201', department: 'Engineering', role: 'manager', photo: '', joinDate: '2017-01-20' },
  { id: 'HR0001', name: 'Priya HR', email: 'priya.hr@company.com', phone: '9876543215', department: 'HR', role: 'hr', photo: '', joinDate: '2019-06-15' },
  { id: 'ADMIN001', name: 'John Admin', email: 'john.admin@company.com', phone: '9876543200', department: 'Engineering', role: 'admin', photo: '', joinDate: '2015-04-01' },
];

const dummyAttendance = [
  { id: 1, employeeId: 'EMP0001', employeeName: 'Ravi Kumar', department: 'Engineering', date: '2026-10-20', checkIn: '09:00 AM', checkOut: '06:30 PM', totalHours: 9.5, status: 'Present' },
  { id: 2, employeeId: 'EMP0002', employeeName: 'Anita Patel', department: 'HR', date: '2026-10-20', checkIn: '09:15 AM', checkOut: '06:00 PM', totalHours: 8.75, status: 'Late' },
  { id: 3, employeeId: 'EMP0003', employeeName: 'Rohan Mehta', department: 'Sales', date: '2026-10-20', checkIn: '--', checkOut: '--', totalHours: 0, status: 'Absent' },
  { id: 4, employeeId: 'EMP0004', employeeName: 'Priya Sharma', department: 'Finance', date: '2026-10-20', checkIn: '09:00 AM', checkOut: '01:00 PM', totalHours: 4, status: 'Half-day' },
  { id: 5, employeeId: 'EMP0005', employeeName: 'Kiran Das', department: 'Engineering', date: '2026-10-20', checkIn: '08:45 AM', checkOut: '05:45 PM', totalHours: 9, status: 'Present' },
  { id: 6, employeeId: 'EMP0001', employeeName: 'Ravi Kumar', department: 'Engineering', date: '2026-10-21', checkIn: '09:10 AM', checkOut: '06:45 PM', totalHours: 9.25, status: 'Late' },
  { id: 7, employeeId: 'EMP0002', employeeName: 'Anita Patel', department: 'HR', date: '2026-10-21', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: 9, status: 'Present' },
  { id: 8, employeeId: 'EMP0003', employeeName: 'Rohan Mehta', department: 'Sales', date: '2026-10-21', checkIn: '--', checkOut: '--', totalHours: 0, status: 'On Leave' },
  { id: 9, employeeId: 'EMP0004', employeeName: 'Priya Sharma', department: 'Finance', date: '2026-10-21', checkIn: '09:30 AM', checkOut: '02:00 PM', totalHours: 4.5, status: 'Half-day' },
  { id: 10, employeeId: 'EMP0005', employeeName: 'Kiran Das', department: 'Engineering', date: '2026-10-21', checkIn: '09:00 AM', checkOut: '05:30 PM', totalHours: 8.5, status: 'Present' },
];

// API functions
export const api = {
  // Employees
  getEmployees: async () => {
    if (USE_DUMMY_DATA) return { data: dummyEmployees.map(mapEmployee), error: null };
    const { data, error } = await safeFetch(`${API_BASE_URL}/backend/api/manager/employees`);
    if (error || !data) return { data: [], error };
    const list = Array.isArray(data) ? data : data.employees || data.data || [];
    return { data: list.map(mapEmployee), error: null };
  },

  getEmployee: async (id) => {
    if (USE_DUMMY_DATA) {
      const found = dummyEmployees.find(e => e.id === id || e.employeeId === id);
      return { data: found ? mapEmployee(found) : null, error: null };
    }
    const { data, error } = await safeFetch(`${API_BASE_URL}/backend/api/manager/profile?id=${id}`);
    if (error || !data) return { data: null, error };
    return { data: mapEmployee(data), error: null };
  },

  // Attendance
  getAttendance: async ({ date, month, department, status, search, page } = {}) => {
    if (USE_DUMMY_DATA) {
      let filtered = dummyAttendance;
      if (department) filtered = filtered.filter(a => a.department === department);
      if (status) filtered = filtered.filter(a => a.status === status);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(a => a.employeeName.toLowerCase().includes(s) || a.employeeId.toLowerCase().includes(s));
      }
      if (date) filtered = filtered.filter(a => a.date === date);
      return { data: filtered.map(mapAttendance), error: null, total: filtered.length };
    }
    const qs = new URLSearchParams();
    if (date) qs.set('date', date);
    if (month) qs.set('month', month);
    if (department) qs.set('department', department);
    if (status) qs.set('status', status);
    if (search) qs.set('search', search);
    if (page) qs.set('page', page);
    const { data, error } = await safeFetch(`${API_BASE_URL}/backend/api/manager/attendance?${qs.toString()}`);
    if (error || !data) return { data: [], error, total: 0 };
    const list = Array.isArray(data) ? data : data.attendance || data.data || [];
    return { data: list.map(mapAttendance), error: null, total: list.length };
  },

  getEmployeeAttendance: async (id, month) => {
    if (USE_DUMMY_DATA) {
      const filtered = dummyAttendance.filter(a => a.employeeId === id);
      return { data: filtered.map(mapAttendance), error: null };
    }
    const qs = new URLSearchParams();
    if (month) qs.set('month', month);
    const { data, error } = await safeFetch(`${API_BASE_URL}/backend/api/manager/attendance?employee_id=${id}&${qs.toString()}`);
    if (error || !data) return { data: [], error };
    const list = Array.isArray(data) ? data : data.attendance || data.data || [];
    return { data: list.map(mapAttendance), error: null };
  },

  // Profile
  getProfile: async (id) => {
    if (USE_DUMMY_DATA) {
      const found = dummyEmployees.find(e => e.id === id || e.employeeId === id || e.user_id === id);
      return { data: found ? mapProfile(found) : null, error: null };
    }
    const { data, error } = await safeFetch(`${API_BASE_URL}/backend/api/profile/profile.php?id=${id}`);
    if (error || !data) return { data: null, error };
    const raw = data.profile || data;
    return { data: mapProfile(raw), error: null };
  },
};
