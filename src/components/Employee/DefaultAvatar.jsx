import React from "react";

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase().trim();
  if (normalized === "active" || normalized === "online" || normalized === "present") return "#10b981";
  return "#ef4444";
};

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "?";
};

const stringToColor = (value) => {
  const text = String(value || "").trim();
  if (!text) return { bg: "#dbeafe", text: "#1e3a8a" };

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const bg = `hsl(${hue}, 82%, 92%)`;
  const textColor = `hsl(${hue}, 70%, 25%)`;

  return { bg, text: textColor };
};

const DefaultAvatar = ({ name, status, size = 80, style }) => {
  const initials = getInitials(name);
  const normalizedStatus = String(status || "").toLowerCase().trim();
  const statusColor = getStatusColor(normalizedStatus);

  const colors = stringToColor(name);

  const statusSize = Math.max(12, size * 0.18);
  const statusBorder = Math.max(2, size * 0.03);

  const fontSize = size * 0.38;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
          position: "relative",
          background: colors.bg,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="avatar-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="avatar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#3b82f630" />
            </filter>
          </defs>

          <circle cx="50" cy="50" r="49" fill="none" stroke="#ffffff" strokeWidth="2" />
          <circle cx="50" cy="50" r="47" fill="none" stroke="url(#avatar-ring)" strokeWidth="1.5" opacity="0.7" filter="url(#avatar-glow)" />

          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="central"
            fill={colors.text}
            fontSize={fontSize}
            fontWeight="700"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="1"
          >
            {initials}
          </text>
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: size * 0.08,
          right: size * 0.08,
          width: statusSize,
          height: statusSize,
          borderRadius: "50%",
          backgroundColor: statusColor,
          border: `${statusBorder}px solid #ffffff`,
          boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.08)",
        }}
        title={normalizedStatus || "unknown"}
      />
    </div>
  );
};

export default DefaultAvatar;
