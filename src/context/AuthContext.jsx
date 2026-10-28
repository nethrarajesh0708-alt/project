import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TEMP DESIGN PHASE: skip API call. Restore original session check before launch.
    setLoading(false);
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    try {
      const res = await fetch(`${BASE_URL}backend/api/auth/check_session.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Failed to sync full user session after login", err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${BASE_URL}backend/api/auth/logout.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.clear();
        console.log(data.message);
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout request error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
