import React, { createContext, useContext, useState, useEffect } from "react";

const SuperAdminContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const SuperAdminProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("super_admin");
    if (stored) {
      setSuperAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setSuperAdmin(userData);
    localStorage.setItem("super_admin", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}backend/api/super_admin/logout.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setSuperAdmin(null);
      localStorage.removeItem("super_admin");
    }
  };

  return (
    <SuperAdminContext.Provider value={{ superAdmin, login, logout, loading }}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => useContext(SuperAdminContext);
