import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Table, Row, Col } from 'react-bootstrap';
import ProductivityMeter from '../components/Employee/ProductivityMeter';
import { loadSessionRecords } from '../utils/sessionStorage';
import { minutesToUnits } from '../utils/timeHelpers';

const ActivityPage = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchHistory();
    fetchTodayTotal();
    const historyInterval = setInterval(fetchHistory, 30000);
    const totalInterval = setInterval(fetchTodayTotal, 120000);
    return () => {
      clearInterval(historyInterval);
      clearInterval(totalInterval);
    };
  }, []);

  const fetchTodayTotal = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=today_total`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const totalMinutes = Math.max(0, data.total_minutes);
        setTodayTotal(totalMinutes);
      }
    } catch (err) {
      console.error("Failed to fetch today total", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=history&limit=20`, {
        credentials: "include",
      });
      const data = await res.json();
      const localRecords = loadSessionRecords();
      const todayLocal = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

      const filterToday = (sessions) => {
        return sessions.filter((s) => {
          const sessionDate = s.session_date || s.date || '';
          return sessionDate === todayLocal;
        });
      };

      if (data.success && Array.isArray(data.sessions) && data.sessions.length > 0) {
        const now = Date.now();
        const sanitized = data.sessions.map((s) => {
          if (!s.end_time && s.start_time) {
            const start = new Date(s.start_time).getTime();
            const elapsedMs = Math.max(0, now - start);
            const elapsedMin = Math.floor(elapsedMs / 60000);
            return {
              ...s,
              duration_minutes: elapsedMin,
              duration_units: minutesToUnits(elapsedMin),
            };
          }
          return {
            ...s,
            duration_units: s.duration_units ?? minutesToUnits(s.duration_minutes || 0),
          };
        });
        const todaysSessions = filterToday(sanitized);
        const todaysTotal = todaysSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        setTodayTotal(todaysTotal);
        const merged = [...todaysSessions, ...localRecords.filter((record) => !sanitized.some((item) => item.id && item.id === record.session_id))];
        setSessions(merged);
      } else {
        if (!data.success) {
          console.error('Activity history failed:', data.message || data.error || 'Unknown error');
        }
        const todaysLocal = filterToday(localRecords);
        const localTotal = todaysLocal.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        setTodayTotal(localTotal);
        setSessions(todaysLocal);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
      const localRecords = loadSessionRecords();
      const todayLocal = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      setSessions(localRecords.filter((s) => (s.session_date || s.date || '') === todayLocal));
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const safe = Math.max(0, Math.round(minutes || 0));
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}` : `${m}m`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const timePart = String(dateStr).split(' ')[1] || String(dateStr).split('T')[1] || '';
    if (!timePart) return String(dateStr);
    const [hours, minutes] = timePart.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <ProductivityMeter productiveHours={todayTotal / 60} targetHours={8} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Recent Sessions</h5>
          {sessions.length === 0 ? (
            <p className="text-muted text-center py-4">No activity sessions recorded yet.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={session.id || `${session.session_id || 'local'}-${index}`}>
                    <td>{session.session_date || session.date || '-'}</td>
                    <td>{formatDateTime(session.start_time)}</td>
                    <td>{formatDateTime(session.end_time)}</td>
                    <td>{formatDuration(session.duration_minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ActivityPage;