import {
  mockOverviewStats,
  mockLeaveRequests,
  mockAttendance,
  mockEmployees,
} from '../components/HR/mockData';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/dashboard_stats.php`, { credentials: 'include' })
export const getOverviewStats = async () => {
  return { success: true, data: mockOverviewStats };
};

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/leave_requests.php?status=${status}&from=${from}&to=${to}&employee=${employee}`, { credentials: 'include' })
export const getLeaves = async ({ status = '', from = '', to = '', employee = '' } = {}) => {
  let data = [...mockLeaveRequests];
  if (status) data = data.filter(r => r.status === status);
  if (employee) data = data.filter(r => r.employee_name.toLowerCase().includes(employee.toLowerCase()) || r.employee_id.toLowerCase().includes(employee.toLowerCase()));
  if (from) data = data.filter(r => r.from_date >= from);
  if (to) data = data.filter(r => r.to_date <= to);
  return { success: true, requests: data };
};

// TODO: Replace mock return with:
// fetch(`${API}/backend/api/hr/leave_requests.php`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) })
export const approveLeave = async (id) => {
  return { success: true };
};

export const rejectLeave = async (id) => {
  return { success: true };
};

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/attendance.php?date=${date}&search=${search}`, { credentials: 'include' })
export const getAttendance = async ({ date = '', search = '' } = {}) => {
  let data = [...mockAttendance];
  if (date) data = data.filter(r => r.date === date);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(r => r.employee_name.toLowerCase().includes(q) || r.employee_id.toLowerCase().includes(q));
  }
  return { success: true, records: data };
};

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/employees.php?search=${search}&page=${page}&limit=${limit}`, { credentials: 'include' })
export const getEmployees = async ({ search = '', page = 1, limit = 10 } = {}) => {
  let data = [...mockEmployees];
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.employee_id.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  }
  const total = data.length;
  const paginated = data.slice((page - 1) * limit, page * limit);
  return { success: true, employees: paginated, total };
};

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/employee_detail.php?id=${id}`, { credentials: 'include' })
export const getEmployeeDetail = async (id) => {
  const emp = mockEmployees.find(e => e.id === id);
  return emp ? { success: true, employee: emp } : { success: false };
};

// TODO: Replace mock return with: fetch(`${API}/backend/api/hr/salary.php?employee_id=${employeeId}`, { credentials: 'include' })
export const getSalary = async (employeeId) => {
  const emp = mockEmployees.find(e => e.id === employeeId);
  if (!emp) return { success: false };
  return {
    success: true,
    salary: {
      basic_pay: emp.basic_pay,
      hra: emp.hra,
      allowances: emp.allowances,
      deductions: emp.deductions,
      net_salary: emp.net_salary,
      bank_account: emp.bank_account,
      pan: emp.pan,
      payslip_history: emp.payslip_history,
    },
  };
};
