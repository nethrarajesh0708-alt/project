import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ManagerSidebar from './ManagerSidebar';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { sendMessage, createGroup } from '../../services/chatService';
import './ManagerChat.css';

const ManagerChat = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();

  // Get manager name from email
  const getName = () => {
    if (!user?.email) return 'Manager';
    const local = user.email.split('@')[0];
    return local.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleSelect = (item) => {
    setSelected(item);
    setSearch('');
  };

  const handleSend = (channelId, text) => {
    sendMessage(channelId, text);
  };

  const handlePostUpdate = (channelId) => {
    const updateText = `${getName()} posted an update`;
    sendMessage(channelId, updateText);
  };

  const handleNewGroup = () => {
    if (!groupName.trim()) return;
    createGroup(groupName.trim(), [1, 2, 3]);
    setGroupName('');
    setShowNewGroup(false);
  };

  return (
    <div className="manager-chat-layout">
      <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="manager-chat-main">
        <header className="manager-dashboard-header">
          <div>
            <h1>Hello, {getName()}</h1>
            <p className="manager-datetime">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        <div className="chat-container">
          <ChatSidebar
            search={search}
            selectedId={selected?.id}
            onSelect={handleSelect}
            onNewGroup={() => setShowNewGroup(true)}
          />
          <ChatWindow
            selected={selected}
            onSend={handleSend}
            onPostUpdate={handlePostUpdate}
            onBack={() => setSelected(null)}
          />
        </div>
      </div>

      {showNewGroup && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Group</h5>
                <button type="button" className="btn-close" onClick={() => setShowNewGroup(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Members</label>
                  <select className="form-select" multiple size={4}>
                    <option value={1}>John Admin</option>
                    <option value={2}>Priya HR</option>
                    <option value={3}>Ravi Kumar</option>
                    <option value={4}>Anita Patel</option>
                    <option value={5}>Rohan Mehta</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowNewGroup(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleNewGroup}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerChat;