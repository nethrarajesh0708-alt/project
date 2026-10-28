import React from "react";

/**
 * HrDashboardPlaceholder - Temporary placeholder for HR dashboard
 * Will be replaced with full HR dashboard implementation
 */
const HrDashboardPlaceholder = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#163A7A", fontSize: "2rem", marginBottom: "1rem" }}>
          HR Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export default HrDashboardPlaceholder;