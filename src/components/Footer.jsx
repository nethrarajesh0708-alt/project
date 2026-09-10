import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="deskin-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">Desk.in</span>
          <span className="footer-copy">&copy; 2026 Desk.in</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
