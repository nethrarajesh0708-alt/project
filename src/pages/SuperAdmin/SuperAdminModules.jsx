import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdmin.css";

const SuperAdminModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Modules");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${BASE_URL}backend/api/super_admin/permissions.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setModules(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch modules", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="super-admin-main">
        <header className="super-admin-header">
          <div>
            <h1>Modules Management</h1>
            <p className="super-admin-datetime">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </header>

        <div className="super-admin-content">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="modules-grid">
              {Object.entries(modules).map(([moduleName, perms]) => (
                <div key={moduleName} className="module-card">
                  <div className="module-header">
                    <h3>{moduleName.replace("_", " ").toUpperCase()}</h3>
                    <span className="badge bg-primary">
                      {perms.length} permissions
                    </span>
                  </div>
                  <div className="module-body">
                    {perms.map((perm) => (
                      <div key={perm.id} className="permission-item">
                        <span className="permission-action">{perm.action}</span>
                        <span className="permission-name">{perm.display_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminModules;
