import React from 'react';
import { mockChannels } from '../../mock/chatChannels';
import { mockDirectMessages } from '../../mock/chatDirect';

const ChatSidebar = ({ search, selectedId, onSelect, onNewGroup }) => {
  const filter = (list) => list.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const channels = filter(mockChannels);
  const dms = filter(mockDirectMessages);

  return (
    <div className="chat-sidebar">
      <div className="chat-search">
        <input
          type="text"
          placeholder="Search channels and people..."
          value={search}
          readOnly
        />
        <button className="new-group-btn" onClick={onNewGroup}>+ New Group</button>
      </div>

      <div className="chat-section">
        <h6>Team Channels</h6>
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`chat-item ${selectedId === ch.id ? 'active' : ''}`}
            onClick={() => onSelect(ch)}
          >
            <div className="avatar">{ch.name[0]}</div>
            <div className="chat-info">
              <div className="chat-top">
                <span className="chat-name">{ch.name}</span>
                <span className="chat-time">{ch.lastTime}</span>
              </div>
              <div className="chat-bottom">
                <span className="chat-preview">{ch.lastMsg || 'No messages yet'}</span>
                {ch.unread > 0 && <span className="unread-badge">{ch.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-section">
        <h6>Direct Messages</h6>
        {dms.map((dm) => (
          <div
            key={dm.id}
            className={`chat-item ${selectedId === dm.id ? 'active' : ''}`}
            onClick={() => onSelect(dm)}
          >
            <div className="avatar">{dm.initials}</div>
            <div className="chat-info">
              <div className="chat-top">
                <span className="chat-name">{dm.name}</span>
                <span className="chat-time">{dm.lastTime}</span>
              </div>
              <div className="chat-bottom">
                <span className="chat-preview">{dm.lastMsg}</span>
                {dm.unread > 0 && <span className="unread-badge">{dm.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;