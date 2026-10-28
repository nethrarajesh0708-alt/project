import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* eslint-disable react-refresh/only-export-components */
const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [statusCheckedAt, setStatusCheckedAt] = useState(null);
  const [trackerFields, setTrackerFields] = useState({
    projectCode: "",
    projectName: "",
    projectType: "",
    activityRole: "",
  });
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=status`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const isRunning = data.is_running || false;
        setIsActive(isRunning);
        setActiveSession(isRunning ? data : null);
        setStatusCheckedAt(Date.now());
        if (isRunning) {
          setTrackerFields((current) => ({
            projectCode: data.project_code || current.projectCode || "",
            projectName: data.project_name || current.projectName || "",
            projectType: data.project_type || current.projectType || "",
            activityRole: data.activity_role || current.activityRole || "",
          }));
        }
        return data;
      }
    } catch (err) {
      console.error("Failed to check activity status", err);
    }
    return null;
  }, [BASE_URL]);

  const updateTrackerField = useCallback((field, value) => {
    setTrackerFields((current) => ({ ...current, [field]: value }));
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <ActivityContext.Provider value={{ isActive, setIsActive, checkStatus }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
