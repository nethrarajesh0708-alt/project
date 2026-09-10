import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import ProductivityMeter from "./ProductivityMeter";
import { useActivity } from "../../context/ActivityContext";

const BASE_URL = import.meta.env.VITE_API_URL;

const WorkTracker = () => {
  const { isActive, checkStatus } = useActivity();
  const [projectCode, setProjectCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [activityRole, setActivityRole] = useState("");
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTodayTotal();
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setElapsedSeconds(0);
    }
  }, [isActive]);

  const fetchTodayTotal = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}backend/api/activity/sessions.php?action=today_total`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setTodayTotalMinutes(data.total_minutes || 0);
      }
    } catch (err) {
      console.error("Failed to fetch today total", err);
    }
  };

  const requiredFields = [
    { label: "Project Code", value: projectCode },
    { label: "Project Name", value: projectName },
    { label: "Project Type", value: projectType },
    { label: "Activity Role", value: activityRole },
  ];
  const missingFields = validationAttempted
    ? requiredFields
        .filter((field) => !field.value.trim())
        .map((field) => field.label)
    : [];
  const validationMessage =
    missingFields.length > 0
      ? `Please enter ${missingFields.join(", ")}`
      : "";

  const handleStart = async () => {
    setError("");
    setValidationAttempted(true);

    if (missingFields.length > 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}backend/api/activity/sessions.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "start",
            project_code: projectCode.trim(),
            project_name: projectName.trim(),
            project_type: projectType.trim(),
            activity_role: activityRole.trim(),
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setElapsedSeconds(0);
        checkStatus();
        fetchTodayTotal();
      } else {
        setError(data.message || "Failed to start tracking");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}backend/api/activity/sessions.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "stop" }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setElapsedSeconds(0);
        checkStatus();
        fetchTodayTotal();
      } else {
        setError(data.message || "Failed to stop tracking");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const targetMinutes = 480;
  const progressPercentage = Math.min(
    (todayTotalMinutes / targetMinutes) * 100,
    100
  );
  const productiveHours = todayTotalMinutes / 60;

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="work-tracker p-3 mb-4 bg-white rounded shadow-sm">
      <Row className="align-items-center g-3">
        <Col xs={12} md={5} className="text-center">
          <ProductivityMeter productiveHours={productiveHours} targetHours={8} />
        </Col>
        <Col xs={12} md={7}>
          <div className="tracker-controls">
            <h5 className="fw-bold mb-2">Daily Work Tracker</h5>
            {(validationMessage || error) && (
              <Alert variant="danger" className="py-2 small">
                {validationMessage || error}
              </Alert>
            )}

            <div className="d-flex flex-wrap gap-2 mb-3">
              <Form.Control
                type="text"
                placeholder="Project Code"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                isInvalid={validationAttempted && !projectCode.trim()}
                disabled={isActive || loading}
                size="sm"
              />
              <Form.Control
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                isInvalid={validationAttempted && !projectName.trim()}
                disabled={isActive || loading}
                size="sm"
              />
              <Form.Control
                type="text"
                placeholder="Project Type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                isInvalid={validationAttempted && !projectType.trim()}
                disabled={isActive || loading}
                size="sm"
              />
              <Form.Control
                type="text"
                placeholder="Activity Role"
                value={activityRole}
                onChange={(e) => setActivityRole(e.target.value)}
                isInvalid={validationAttempted && !activityRole.trim()}
                disabled={isActive || loading}
                size="sm"
              />
            </div>

            <div className="mb-3">
              <h3 className="fw-bold text-primary">{formatTime(elapsedSeconds)}</h3>
              <p className="text-muted small mb-0">
                Daily Progress: {Math.round(progressPercentage)}%
              </p>
            </div>

            <div className="d-flex gap-2">
              {!isActive ? (
                <Button
                  variant="success"
                  onClick={handleStart}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Starting..." : "Start Tracking"}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleStop}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Stopping..." : "Stop Tracking"}
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WorkTracker;
