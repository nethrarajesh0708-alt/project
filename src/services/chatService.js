const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const USER_STORAGE_KEY = 'user';

function getSessionUserId() {
  try {
    const u = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    return u?.id;
  } catch { return null; }
}

export const getContacts = async () => {
  const res = await fetch(`${BASE_URL}/backend/api/manager/chat/contacts`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch contacts');
  return data.contacts || [];
};

export const getMessages = async (contactId, page = 1, limit = 50) => {
  const res = await fetch(`${BASE_URL}/backend/api/manager/chat/messages?contact_id=${contactId}&page=${page}&limit=${limit}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch messages');
  return (data.messages || []).map(m => ({
    id: m.id,
    sender: m.sender_name || 'Unknown',
    role: m.sender_id === Number(getSessionUserId()) ? 'manager' : 'employee',
    text: m.content,
    time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    mine: m.sender_id === Number(getSessionUserId()),
    created_at: m.created_at,
  }));
};

export const getChannels = async () => {
  const contacts = await getContacts();
  return contacts.map(c => ({ id: c.id, name: c.name, type: 'dm', members: 1, unread: 0, lastMsg: '', lastTime: '', lastSender: c.role }));
};

export const getDirectMessages = getChannels;

export const sendMessage = async (contactId, text) => {
  const res = await fetch(`${BASE_URL}/backend/api/manager/chat/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiver_id: contactId, content: text }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send message');
  const m = data.message;
  return {
    id: m.id,
    sender: m.sender_name || 'Manager',
    role: 'manager',
    text: m.content,
    time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    mine: true,
    created_at: m.created_at,
  };
};

export const createGroup = () => {
  return Promise.resolve({ id: 0, name: '', type: 'team', members: 0 });
};
