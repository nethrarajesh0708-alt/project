import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* eslint-disable react-refresh/only-export-components */
const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/activity/sessions.php?action=status`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setIsActive(data.is_running || false);
      }
    } catch (err) {
      console.error("Failed to check activity status", err);
    }
  }, [BASE_URL]);

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
