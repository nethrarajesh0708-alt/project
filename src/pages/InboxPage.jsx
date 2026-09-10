import React from 'react';
import { Container } from 'react-bootstrap';
import { FiInbox } from 'react-icons/fi';

const InboxPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center">
        <FiInbox size={48} className="text-primary mb-3" />
        <h2>Inbox</h2>
        <p className="text-muted">Your messages and notifications will appear here.</p>
      </div>
    </Container>
  );
};

export default InboxPage;
