import React, { useState, useEffect, useRef } from 'react';
import { mockMessages } from '../../mock/chatMessages';

const ChatWindow = ({ selected, onSend, onPostUpdate, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selected) {
      setMessages(mockMessages[selected.id] || []);
    }
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(selected.id, input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selected) {
    return (
      <div className="chat-empty">
        <p>Select a channel or person to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-header-left">
          {window.innerWidth < 768 && (
            <button className="back-btn" onClick={onBack}>&larr;</button>
          )}
          <div className="avatar">{selected.name[0]}</div>
          <div>
            <h6 className="mb-0">{selected.name}</h6>
            <small className="text-muted">
              {selected.members || 1} member{selected.members > 1 ? 's' : ''}
            </small>
          </div>
        </div>
        <button className="members-toggle" onClick={() => setShowMembers(!showMembers)}>
          {showMembers ? 'Hide' : 'Show'} Members
        </button>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.mine ? 'mine' : 'other'}`}>
            {!msg.mine && <span className="msg-sender">{msg.sender}</span>}
            <div className="msg-bubble">
              {msg.text}
              {msg.tag === 'Update' && <span className="update-tag">Update</span>}
            </div>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-area">
        <button className="update-btn" onClick={() => onPostUpdate(selected.id)}>
          Post Update
        </button>
        <div className="input-row">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" onClick={handleSend}>Send</button>
        </div>
      </div>

      {showMembers && (
        <div className="members-panel">
          <h6>Members</h6>
          {['John Admin', 'Priya HR', 'Ravi Kumar', 'Rohan Mehta', 'Anita Patel'].map((m) => (
            <div key={m} className="member-item">
              <span className="online-dot"></span>
              <span>{m}</span>
            </div>
          ))}
          <h6 className="mt-3">Pinned Updates</h6>
          <p className="text-muted small">No pinned updates yet.</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;