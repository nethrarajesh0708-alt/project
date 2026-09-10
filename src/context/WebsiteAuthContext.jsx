import React, { createContext, useContext, useState, useEffect } from "react";

const WebsiteAuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const WebsiteAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("website_user");
    if (storedUser) {
      fetch(`${BASE_URL}backend/api/auth/website_check_session.php`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem("website_user");
          }
        })
        .catch(() => {
          localStorage.removeItem("website_user");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("website_user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}backend/api/auth/website_logout.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      localStorage.removeItem("website_user");
    }
  };

  return (
    <WebsiteAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </WebsiteAuthContext.Provider>
  );
};

export const useWebsiteAuth = () => useContext(WebsiteAuthContext);
