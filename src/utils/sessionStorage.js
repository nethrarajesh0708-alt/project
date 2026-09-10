const PAUSED_KEY = 'emp_activity_paused';
const RECORDS_KEY = 'emp_activity_records';

export function todayKey() {
  return `desk_sessions_${new Date().toISOString().slice(0, 10)}`;
}

export function saveSessions(sessions, activeSession) {
  localStorage.setItem(
    todayKey(),
    JSON.stringify({
      sessions,
      activeSession,
      savedAt: Date.now(),
    })
  );
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(todayKey());
    if (!raw) return { sessions: [], activeSession: null };
    const data = JSON.parse(raw);
    return {
      sessions: Array.isArray(data.sessions) ? data.sessions : [],
      activeSession: data.activeSession || null,
    };
  } catch {
    return { sessions: [], activeSession: null };
  }
}

export function clearTodaySessions() {
  localStorage.removeItem(todayKey());
}

export function savePausedState(data) {
  localStorage.setItem(PAUSED_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
}

export function loadPausedState() {
  try {
    const raw = localStorage.getItem(PAUSED_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = Date.now() - (data.savedAt || 0);
    if (age > 86400000) {
      localStorage.removeItem(PAUSED_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearPausedState() {
  localStorage.removeItem(PAUSED_KEY);
}

export function saveSessionRecord(record) {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    let records = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(records)) records = [];
    records.unshift(record);
    if (records.length > 50) records.length = 50;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    localStorage.removeItem(RECORDS_KEY);
  }
}

export function loadSessionRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function clearSessionRecords() {
  localStorage.removeItem(RECORDS_KEY);
}

export function saveTodayTotal(totalMinutes) {
  localStorage.setItem('emp_today_total', JSON.stringify({ totalMinutes, savedAt: Date.now() }));
}

export function loadTodayTotal() {
  try {
    const raw = localStorage.getItem('emp_today_total');
    if (!raw) return 0;
    const data = JSON.parse(raw);
    const age = Date.now() - (data.savedAt || 0);
    if (age > 86400000) {
      localStorage.removeItem('emp_today_total');
      return 0;
    }
    return data.totalMinutes || 0;
  } catch {
    return 0;
  }
}

export function clearTodayTotal() {
  localStorage.removeItem('emp_today_total');
}
