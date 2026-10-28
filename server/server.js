const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 8000;
const DB_PATH = path.join(__dirname, 'database.sqlite');

// ----------------------------------------------------------------
// SQLite via sql.js
// ----------------------------------------------------------------
let SQL;
let db;

async function initDb() {
  SQL = await initSqlJs();
  let existingData = null;
  if (fs.existsSync(DB_PATH)) {
    existingData = fs.readFileSync(DB_PATH);
  }
  db = new SQL.Database(existingData);

  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','hr','manager','employee')),
      department_id INTEGER,
      designation TEXT,
      phone TEXT,
      dob TEXT,
      gender TEXT,
      address TEXT,
      permanent_address TEXT,
      emergency_contact TEXT,
      joining_date TEXT,
      work_location TEXT,
      qualifications TEXT,
      skills TEXT,
      photo_url TEXT,
      manager_id INTEGER,
      leave_balance INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      manager_id INTEGER NOT NULL,
      leave_type TEXT NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      days REAL NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','deferred')),
      approver_id INTEGER,
      acted_at TEXT,
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES users(id),
      FOREIGN KEY (manager_id) REFERENCES users(id),
      FOREIGN KEY (approver_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      status TEXT NOT NULL DEFAULT 'absent' CHECK(status IN ('present','absent','late','on_leave','half_day')),
      hours REAL DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(employee_id, date),
      FOREIGN KEY (employee_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      read_at TEXT,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Application users (email/password based auth)
  db.run(`
    CREATE TABLE IF NOT EXISTS app_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      failed_attempts INTEGER DEFAULT 0,
      locked_until TEXT
    );
  `);

  // Password reset tokens (single-use, hashed, 30 min expiry)
  db.run(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      FOREIGN KEY (user_id) REFERENCES app_users(id)
    );
  `);

  persistDb();
  seed();
}

function persistDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) { /* consume */ }
  stmt.free();
  const r = db.exec('SELECT changes() AS c, last_insert_rowid() AS i');
  const c = (r.length && r[0].values && r[0].values.length) ? r[0].values[0][0] : 0;
  const i = (r.length && r[0].values && r[0].values.length) ? r[0].values[0][1] : 0;
  return { changes: c, lastInsertRowid: i };
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = [];
  while (stmt.step()) { result.push(stmt.get()); }
  const cols = stmt.getColumnNames();
  stmt.free();
  return result.map(row => {
    const obj = {};
    cols.forEach((name, i) => { obj[name] = row[i]; });
    return obj;
  });
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.get();
  const cols = stmt.getColumnNames();
  stmt.free();
  if (!row) return undefined;
  const obj = {};
  cols.forEach((name, i) => { obj[name] = row[i]; });
  return obj;
}

function seed() {
  const deptInsert = db.prepare('INSERT OR IGNORE INTO departments (name) VALUES (?), (?), (?), (?)');
  deptInsert.run(['Engineering', 'HR', 'Sales', 'Finance']);

  const eng = get('SELECT id FROM departments WHERE name = ?', ['Engineering']).id;
  const hr = get('SELECT id FROM departments WHERE name = ?', ['HR']).id;
  const sales = get('SELECT id FROM departments WHERE name = ?', ['Sales']).id;
  const fin = get('SELECT id FROM departments WHERE name = ?', ['Finance']).id;

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Manager: Rahul (manager001)
  const mgrInsert = db.prepare(`
    INSERT OR IGNORE INTO users (employee_id, name, email, password_hash, role, department_id, designation, phone, dob, gender, address, permanent_address, emergency_contact, joining_date, work_location, qualifications, skills, photo_url, manager_id, leave_balance, status, is_active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  mgrInsert.run([
    'EMPMGR001', 'Rahul Manager', 'rahul.manager@company.com', hash('Mgr@001'), 'manager', eng,
    'Engineering Manager', '9876543200', '1985-01-15', 'Male', '123 MG Road, Bangalore', '123 MG Road, Bangalore',
    '9876543201', '2015-03-01', 'Bangalore', 'B.Tech Computer Science', 'Java, React, Node.js',
    null, null, 15, 'active', 1
  ]);

  const mgr = get('SELECT id FROM users WHERE employee_id = ?', ['EMPMGR001']).id;

  // Second manager (for 403 cross-team tests)
  const mgr2Insert = db.prepare(`
    INSERT OR IGNORE INTO users (employee_id, name, email, password_hash, role, department_id, designation, phone, manager_id, leave_balance, status, is_active)
    VALUES (?,?,?,?,?,?,?,?,NULL,?,?,?)
  `);
  mgr2Insert.run(['EMPMGR002', 'Sarah Manager', 'sarah.manager@company.com', hash('Mgr@002'), 'manager', hr, 'HR Manager', '9876543202', 12, 'active', 1]);
  const mgr2 = get('SELECT id FROM users WHERE employee_id = ?', ['EMPMGR002']).id;

  // Direct reports of Rahul
  const reports = [
    { eid: 'EMP0001', name: 'Ravi Kumar', email: 'ravi.kumar@company.com', pw: 'Emp@001', role: 'employee', dept: eng, desig: 'Senior Developer', phone: '9876543210', dob: '1990-05-15', gender: 'Male', addr: '123 MG Road, Bangalore', perm: '123 MG Road, Bangalore', emerg: '9876543211', join: '2018-03-01', loc: 'Bangalore', qual: 'B.Tech Computer Science', skills: 'Java, Spring Boot', bal: 12 },
    { eid: 'EMP0002', name: 'Anita Patel', email: 'anita.patel@company.com', pw: 'Emp@002', role: 'employee', dept: hr, desig: 'HR Executive', phone: '9876543212', dob: '1992-08-20', gender: 'Female', addr: '456 Brigade Road, Bangalore', perm: '456 Brigade Road, Bangalore', emerg: '9876543213', join: '2019-06-15', loc: 'Bangalore', qual: 'MBA HR', skills: 'Recruitment, Payroll', bal: 10 },
    { eid: 'EMP0003', name: 'Rohan Mehta', email: 'rohan.mehta@company.com', pw: 'Emp@003', role: 'employee', dept: sales, desig: 'Sales Manager', phone: '9876543213', dob: '1988-11-10', gender: 'Male', addr: '789 Cantonment Rd, Bangalore', perm: '789 Cantonment Rd, Bangalore', emerg: '9876543214', join: '2017-01-20', loc: 'Bangalore', qual: 'B.Com', skills: 'Sales, Negotiation', bal: 8 },
    { eid: 'EMP0004', name: 'Priya Sharma', email: 'priya.sharma@company.com', pw: 'Emp@004', role: 'employee', dept: fin, desig: 'Accountant', phone: '9876543214', dob: '1991-03-25', gender: 'Female', addr: '321 Jayanagar, Bangalore', perm: '321 Jayanagar, Bangalore', emerg: '9876543215', join: '2019-09-10', loc: 'Bangalore', qual: 'M.Com', skills: 'Accounting, Tally', bal: 9 },
  ];
  const empInsert = db.prepare(`
    INSERT OR IGNORE INTO users (employee_id, name, email, password_hash, role, department_id, designation, phone, dob, gender, address, permanent_address, emergency_contact, joining_date, work_location, qualifications, skills, manager_id, leave_balance, status, is_active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  for (const r of reports) {
    empInsert.run([r.eid, r.name, r.email, hash(r.pw), r.role, r.dept, r.desig, r.phone, r.dob, r.gender, r.addr, r.perm, r.emerg, r.join, r.loc, r.qual, r.skills, mgr, r.bal, 'active', 1]);
  }

  // Employee reporting to Sarah (for cross-team 403 test)
  empInsert.run(['EMP0005', 'Kiran Das', 'kiran.das@company.com', hash('Emp@005'), 'employee', eng, 'Junior Developer', '9876543215', '1995-07-12', 'Male', '555 Koramangala, Bangalore', '555 Koramangala, Bangalore', '9876543216', '2022-02-01', 'Bangalore', 'B.Tech IT', 'React, Node.js', mgr2, 11, 'active', 1]);

  // Admin (for role redirect test)
  db.prepare(`INSERT OR IGNORE INTO users (employee_id, name, email, password_hash, role, department_id, designation, manager_id, leave_balance, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(['ADMIN001', 'John Admin', 'john.admin@company.com', hash('Admin@123'), 'admin', eng, 'System Admin', null, 20, 'active', 1]);

  // HR (for role redirect test)
  db.prepare(`INSERT OR IGNORE INTO users (employee_id, name, email, password_hash, role, department_id, designation, manager_id, leave_balance, status, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(['HR0001', 'Priya HR', 'priya.hr@company.com', hash('Hr@001'), 'hr', hr, 'HR Lead', null, 18, 'active', 1]);

  // Leave requests for Rahul's team
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const leaveInsert = db.prepare(`
    INSERT OR IGNORE INTO leave_requests (employee_id, manager_id, leave_type, from_date, to_date, days, reason, status, created_at)
    VALUES (?,?,?,?,?,?,?,?,?)
  `);
  const ravi = get('SELECT id FROM users WHERE employee_id = ?', ['EMP0001']).id;
  const anita = get('SELECT id FROM users WHERE employee_id = ?', ['EMP0002']).id;
  const rohan = get('SELECT id FROM users WHERE employee_id = ?', ['EMP0003']).id;

  leaveInsert.run([ravi, mgr, 'Sick Leave', fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)), fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)), 2, 'Fever and cold', 'pending', new Date().toISOString()]);
  leaveInsert.run([anita, mgr, 'Casual Leave', fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)), fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)), 1, 'Personal work', 'pending', new Date().toISOString()]);
  leaveInsert.run([rohan, mgr, 'Annual Leave', fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10)), fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)), 6, 'Family vacation', 'approved', new Date().toISOString()]);

  // Attendance for today for Rahul's team
  const attInsert = db.prepare(`
    INSERT OR IGNORE INTO attendance (employee_id, date, check_in, check_out, status, hours, updated_at)
    VALUES (?,?,?,?,?,?,?)
  `);
  const todayStr = fmt(today);
  attInsert.run([ravi, todayStr, '09:00', '06:30', 'present', 9.5, new Date().toISOString()]);
  attInsert.run([anita, todayStr, '09:15', '06:00', 'late', 8.75, new Date().toISOString()]);
  attInsert.run([rohan, todayStr, null, null, 'absent', 0, new Date().toISOString()]);
  const priya = get('SELECT id FROM users WHERE employee_id = ?', ['EMP0004']).id;
  attInsert.run([priya, todayStr, null, null, 'on_leave', 0, new Date().toISOString()]);

  persistDb();
}

// ----------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  name: 'connect.sid',
  secret: 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// ----------------------------------------------------------------
// Auth middleware
// ----------------------------------------------------------------
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: no session' });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no session' });
    }
    if (req.session.role !== role) {
      return res.status(403).json({ success: false, message: `Forbidden: ${role} role required` });
    }
    next();
  };
}

function getUserById(id) {
  return get('SELECT id, employee_id, name, email, role, department_id, designation, phone, dob, gender, address, permanent_address, emergency_contact, joining_date, work_location, qualifications, skills, photo_url, manager_id, leave_balance, status, is_active FROM users WHERE id = ?', [id]);
}

// ----------------------------------------------------------------
// Auth routes
// ----------------------------------------------------------------
app.post('/backend/api/auth/login', (req, res) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password) {
    return res.status(400).json({ success: false, message: 'Employee ID and password are required' });
  }

  const user = get('SELECT * FROM users WHERE employee_id = ?', [employee_id]);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid employee ID or password' });
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.employeeId = user.employee_id;
  req.session.managerId = user.manager_id;

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      employee_id: user.employee_id,
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      designation: user.designation,
      manager_id: user.manager_id,
      photo_url: user.photo_url,
    },
  });
});

app.post('/backend/api/auth/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out' });
  });
});

app.get('/backend/api/auth/check_session', requireAuth, (req, res) => {
  const user = getUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Session invalid' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      employee_id: user.employee_id,
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      designation: user.designation,
      manager_id: user.manager_id,
      photo_url: user.photo_url,
    },
  });
});

// ----------------------------------------------------------------
// Manager: Dashboard stats
// ----------------------------------------------------------------
app.get('/backend/api/manager/dashboard_stats', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const today = new Date().toISOString().split('T')[0];

  const teamSize = get('SELECT COUNT(*) AS c FROM users WHERE manager_id = ? AND is_active = 1', [managerId]).c;
  const pendingLeaves = get('SELECT COUNT(*) AS c FROM leave_requests WHERE manager_id = ? AND status = ?', [managerId, 'pending']).c;

  const presentToday = get(`SELECT COUNT(*) AS c FROM attendance a JOIN users u ON a.employee_id = u.id WHERE u.manager_id = ? AND a.date = ? AND a.status = 'present'`, [managerId, today]).c;
  const absentToday = get(`SELECT COUNT(*) AS c FROM attendance a JOIN users u ON a.employee_id = u.id WHERE u.manager_id = ? AND a.date = ? AND a.status = 'absent'`, [managerId, today]).c;
  const onLeaveToday = get(`SELECT COUNT(*) AS c FROM attendance a JOIN users u ON a.employee_id = u.id WHERE u.manager_id = ? AND a.date = ? AND a.status = 'on_leave'`, [managerId, today]).c;

  const recentLeaves = all(`
    SELECT lr.id, u.name AS employee_name, u.employee_id, lr.leave_type, lr.from_date, lr.to_date, lr.days, lr.reason, lr.status, lr.created_at
    FROM leave_requests lr
    JOIN users u ON lr.employee_id = u.id
    WHERE lr.manager_id = ?
    ORDER BY lr.created_at DESC
    LIMIT 5
  `, [managerId]);

  const recentActivity = all(`
    SELECT a.id, u.name AS employee_name, u.employee_id, a.date, a.status, a.check_in, a.check_out
    FROM attendance a
    JOIN users u ON a.employee_id = u.id
    WHERE u.manager_id = ?
    ORDER BY a.date DESC, a.id DESC
    LIMIT 5
  `, [managerId]);

  res.json({
    success: true,
    data: {
      total_team_members: teamSize,
      pending_leaves: pendingLeaves,
      present_today: presentToday,
      absent_today: absentToday,
      on_leave_today: onLeaveToday,
      recent_leaves: recentLeaves,
      recent_activity: recentActivity,
    },
  });
});

// ----------------------------------------------------------------
// Manager: Leave requests
// ----------------------------------------------------------------
app.get('/backend/api/manager/leave_requests', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { status, from, to } = req.query;
  let sql = `
    SELECT lr.id, u.name AS employee_name, u.employee_id, lr.leave_type, lr.from_date, lr.to_date,
           lr.days, lr.reason, lr.status, lr.rejection_reason, lr.approver_id, lr.acted_at, lr.created_at
    FROM leave_requests lr
    JOIN users u ON lr.employee_id = u.id
    WHERE lr.manager_id = ?
  `;
  const params = [managerId];
  if (status) { sql += ' AND lr.status = ?'; params.push(status); }
  if (from) { sql += ' AND lr.from_date >= ?'; params.push(from); }
  if (to) { sql += ' AND lr.to_date <= ?'; params.push(to); }
  sql += ' ORDER BY lr.created_at DESC';
  const rows = all(sql, params);
  res.json({ success: true, requests: rows });
});

app.post('/backend/api/manager/leave_requests', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { id, action, remarks } = req.body;
  if (!id || !action) {
    return res.status(400).json({ success: false, message: 'Request ID and action are required' });
  }
  if (action === 'reject' && (!remarks || remarks.trim() === '')) {
    return res.status(400).json({ success: false, message: 'Rejection comment is required' });
  }

  const leave = get('SELECT * FROM leave_requests WHERE id = ? AND manager_id = ?', [id, managerId]);
  if (!leave) {
    return res.status(404).json({ success: false, message: 'Leave request not found or not in your team' });
  }
  if (leave.status !== 'pending') {
    return res.status(400).json({ success: false, message: `Leave request already ${leave.status}` });
  }

  const now = new Date().toISOString();
  const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'deferred';

  const updateLeave = db.prepare(`UPDATE leave_requests SET status = ?, approver_id = ?, acted_at = ?, rejection_reason = ?, updated_at = ? WHERE id = ?`);
  updateLeave.run([newStatus, managerId, now, action === 'reject' ? remarks : null, now, id]);

  if (action === 'approve') {
    const emp = get('SELECT leave_balance FROM users WHERE id = ?', [leave.employee_id]);
    if (emp && emp.leave_balance >= leave.days) {
      db.prepare('UPDATE users SET leave_balance = leave_balance - ? WHERE id = ?').run([leave.days, leave.employee_id]);
    }
  }

  res.json({ success: true, message: `Leave request ${newStatus}` });
});

// ----------------------------------------------------------------
// Manager: Attendance
// ----------------------------------------------------------------
app.get('/backend/api/manager/attendance', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { date, from, to } = req.query;
  let sql = `
    SELECT a.id, u.name AS employee_name, u.employee_id, a.date, a.check_in, a.check_out,
           a.status, a.hours
    FROM attendance a
    JOIN users u ON a.employee_id = u.id
    WHERE u.manager_id = ?
  `;
  const params = [managerId];
  if (date) { sql += ' AND a.date = ?'; params.push(date); }
  if (from) { sql += ' AND a.date >= ?'; params.push(from); }
  if (to) { sql += ' AND a.date <= ?'; params.push(to); }
  sql += ' ORDER BY a.date DESC, u.name';
  const rows = all(sql, params);
  res.json({ success: true, records: rows });
});

app.get('/backend/api/manager/attendance/summary', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ success: false, message: 'Month (YYYY-MM) is required' });
  }
  const rows = all(`
    SELECT u.id, u.name AS employee_name, u.employee_id, u.designation,
           SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_days,
           SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent_days,
           SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late_days,
           SUM(CASE WHEN a.status = 'on_leave' THEN 1 ELSE 0 END) AS on_leave_days,
           SUM(a.hours) AS total_hours
    FROM users u
    LEFT JOIN attendance a ON a.employee_id = u.id AND a.date LIKE ?
    WHERE u.manager_id = ? AND u.is_active = 1
    GROUP BY u.id
    ORDER BY u.name
  `, [`${month}%`, managerId]);
  res.json({ success: true, summary: rows });
});

// ----------------------------------------------------------------
// Manager: Team members (direct reports)
// ----------------------------------------------------------------
app.get('/backend/api/manager/employees', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { search, department } = req.query;
  let sql = `
    SELECT u.id, u.employee_id, u.name, u.email, u.phone, u.designation, u.status,
           u.photo_url, u.joining_date, u.leave_balance, d.name AS department_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.manager_id = ? AND u.is_active = 1 AND u.role = 'employee'
  `;
  const params = [managerId];
  if (search) {
    sql += ' AND (u.name LIKE ? OR u.employee_id LIKE ? OR u.email LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (department) {
    sql += ' AND u.department_id = ?';
    params.push(department);
  }
  sql += ' ORDER BY u.name';
  const rows = all(sql, params);
  res.json({ success: true, employees: rows });
});

// ----------------------------------------------------------------
// Manager: Profile
// ----------------------------------------------------------------
const READ_ONLY_FIELDS = ['employee_id', 'role', 'department_id', 'designation'];

app.get('/backend/api/manager/profile', requireRole('manager'), (req, res) => {
  const user = getUserById(req.session.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

app.put('/backend/api/manager/profile', requireRole('manager'), (req, res) => {
  const userId = req.session.userId;
  const {
    name, email, phone, dob, gender, address, permanent_address,
    emergency_contact, joining_date, work_location, qualifications, skills, photo_url,
  } = req.body;

  const bodyKeys = Object.keys(req.body);
  const attemptedReadOnly = bodyKeys.filter(k => READ_ONLY_FIELDS.includes(k));
  if (attemptedReadOnly.length > 0) {
    return res.status(403).json({
      success: false,
      message: `Read-only fields cannot be changed: ${attemptedReadOnly.join(', ')}`,
    });
  }

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (email && email !== user.email) {
    const existing = get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
  }

  const update = db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      dob = COALESCE(?, dob),
      gender = COALESCE(?, gender),
      address = COALESCE(?, address),
      permanent_address = COALESCE(?, permanent_address),
      emergency_contact = COALESCE(?, emergency_contact),
      joining_date = COALESCE(?, joining_date),
      work_location = COALESCE(?, work_location),
      qualifications = COALESCE(?, qualifications),
      skills = COALESCE(?, skills),
      photo_url = COALESCE(?, photo_url)
    WHERE id = ?
  `);
  update.run([name, email, phone, dob, gender, address, permanent_address, emergency_contact,
    joining_date, work_location, qualifications, skills, photo_url, userId]);

  const updated = getUserById(userId);
  res.json({ success: true, message: 'Profile updated', user: updated });
});

app.post('/backend/api/manager/change_password', requireRole('manager'), (req, res) => {
  const userId = req.session.userId;
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }
  const user = get('SELECT password_hash FROM users WHERE id = ?', [userId]);
  if (!user || !bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }
  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run([hash, userId]);
  res.json({ success: true, message: 'Password changed successfully' });
});

// ----------------------------------------------------------------
// Manager: Chat
// ----------------------------------------------------------------
app.get('/backend/api/manager/chat/contacts', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const rows = all(`
    SELECT u.id, u.name, u.email, u.photo_url, u.role
    FROM users u
    WHERE u.manager_id = ? AND u.is_active = 1 AND u.role = 'employee'
    ORDER BY u.name
  `, [managerId]);
  res.json({ success: true, contacts: rows });
});

app.get('/backend/api/manager/chat/messages', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { contact_id, page = 1, limit = 50 } = req.query;
  if (!contact_id) return res.status(400).json({ success: false, message: 'contact_id required' });

  const contact = get('SELECT id FROM users WHERE id = ? AND manager_id = ? AND is_active = 1', [contact_id, managerId]);
  if (!contact) return res.status(403).json({ success: false, message: 'Not your team member' });

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const rows = all(`
    SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, m.read_at,
           s.name AS sender_name
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?
  `, [managerId, contact_id, contact_id, managerId, parseInt(limit), offset]);
  res.json({ success: true, messages: rows.reverse(), page: parseInt(page), limit: parseInt(limit) });
});

app.post('/backend/api/manager/chat/messages', requireRole('manager'), (req, res) => {
  const managerId = req.session.userId;
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) return res.status(400).json({ success: false, message: 'receiver_id and content required' });

  const contact = get('SELECT id FROM users WHERE id = ? AND manager_id = ? AND is_active = 1', [receiver_id, managerId]);
  if (!contact) return res.status(403).json({ success: false, message: 'Not your team member' });

  const now = new Date().toISOString();
  const result = db.prepare('INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?,?,?,?)').run([managerId, receiver_id, content, now]);
  const msg = get('SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, m.read_at, s.name AS sender_name FROM messages m JOIN users s ON m.sender_id = s.id WHERE m.id = ?', [result.lastInsertRowid]);
  res.json({ success: true, message: msg });
});

// ----------------------------------------------------------------
// Departments
// ----------------------------------------------------------------
app.get('/backend/api/departments', requireAuth, (req, res) => {
  const rows = all('SELECT id, name FROM departments ORDER BY name');
  res.json({ success: true, departments: rows });
});

app.get('/backend/api/department/fetctDepartment.php', requireAuth, (req, res) => {
  const rows = all('SELECT id, name FROM departments ORDER BY name');
  res.json({ success: true, departments: rows });
});

app.get('/backend/api/department/fetctDepartment', requireAuth, (req, res) => {
  const rows = all('SELECT id, name FROM departments ORDER BY name');
  res.json({ success: true, departments: rows });
});

// ----------------------------------------------------------------
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
