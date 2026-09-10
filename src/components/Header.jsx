import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DefaultAvatar from "../components/Employee/DefaultAvatar";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?.role === "employee") {
      fetch(`${BASE_URL}backend/api/profile/profile.php`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProfile(data.profile);
          }
        })
        .catch(() => {
          // ignore profile fetch errors in header
        });
    }
  }, [user, BASE_URL]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) return null;

  return (
    <header className="header">
      <nav className="nav container">
        <div className="logo-container">
          <h1 className="logo">Desk.in</h1>
        </div>

        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <ul className="nav-links">
          {!user && (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
              </li>
            </>
          )}

          {user && (
            <>
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/AdminDashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin Dashboard</NavLink>
                </li>
              )}
              {user.role === 'hr' && (
                <li>
                  <NavLink to="/HrDashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>HR Dashboard</NavLink>
                </li>
              )}
              {user.role === 'employee' && (
                <li>
                  <NavLink to="/EmployeeDashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Dashboard</NavLink>
                </li>
              )}
            </>
          )}

          {!user ? (
            <li>
              <NavLink to="/LoginFetch" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>
              </li>
              <li>
                <button className="nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>

        {user?.role === "employee" && profile && (
          <div className="profile-section">
            <div className="profile-details">
              <DefaultAvatar name={profile.full_name} gender={profile.gender} status={profile.status} size={50} />
              <span className="profile-name">{profile.full_name}</span>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
};

export default Header;