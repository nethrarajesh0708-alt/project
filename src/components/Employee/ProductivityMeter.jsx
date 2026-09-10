import React, { useState, useEffect, useRef } from "react";
import "./ProductivityMeter.css";

const ProductivityMeter = ({ productiveHours = 0, targetHours = 9 }) => {
  const rawPercentage = (productiveHours / targetHours) * 100;
  const targetPercentage = Math.min(Math.max(rawPercentage, 0), 100);
  const [displayPct, setDisplayPct] = useState(0);
  const rafRef = useRef(null);
  const startPctRef = useRef(0);

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
  };

  const getLiquidColor = (pct) => {
    if (pct <= 25) return "#EF4444";
    if (pct <= 50) return "#F59E0B";
    if (pct <= 75) return "#10B981";
    return "#2563EB";
  };

  const getColorClass = (pct) => {
    if (pct <= 25) return "color-red";
    if (pct <= 50) return "color-orange";
    if (pct <= 75) return "color-green";
    return "color-blue";
  };

  const liquidColor = getLiquidColor(displayPct);
  const colorClass = getColorClass(displayPct);

  useEffect(() => {
    const startPct = startPctRef.current;
    const targetPct = targetPercentage;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startPct + (targetPct - startPct) * eased;
      setDisplayPct(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        startPctRef.current = targetPct;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetPercentage]);

  useEffect(() => {
    startPctRef.current = displayPct;
  }, [displayPct]);

  const surfaceY = 200 - (displayPct / 100) * 200;
  const waveAmplitude = 6;

  return (
    <div className="productivity-wrapper">
      <div className="productivity-card">
        <div className="productivity-circle-container">
          <div className="productivity-circle">
            <svg className="productivity-svg" viewBox="0 0 200 200">
              <defs>
                <clipPath id="circleClip">
                  <circle cx="100" cy="100" r="90" />
                </clipPath>
                <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={liquidColor} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={liquidColor} stopOpacity="1" />
                </linearGradient>
              </defs>

              <g clipPath="url(#circleClip)">
                <g className="productivity-liquid-body">
                  <rect
                    x="0"
                    y={surfaceY}
                    width="200"
                    height={200}
                    fill="url(#liquidGradient)"
                    className="productivity-liquid-rect"
                  />

                  <g className="wave-layer wave-back">
                    <path
                      className="wave-path"
                      d={`M0,${surfaceY} C25,${surfaceY - waveAmplitude} 50,${surfaceY + waveAmplitude} 75,${surfaceY} C100,${surfaceY - waveAmplitude} 125,${surfaceY + waveAmplitude} 150,${surfaceY} C175,${surfaceY - waveAmplitude} 200,${surfaceY + waveAmplitude} 225,${surfaceY} C250,${surfaceY - waveAmplitude} 275,${surfaceY + waveAmplitude} 300,${surfaceY} L300,200 L0,200 Z`}
                      fill={liquidColor}
                      opacity="0.45"
                    />
                    <path
                      className="wave-highlight"
                      d={`M0,${surfaceY} C25,${surfaceY - waveAmplitude} 50,${surfaceY + waveAmplitude} 75,${surfaceY} C100,${surfaceY - waveAmplitude} 125,${surfaceY + waveAmplitude} 150,${surfaceY} C175,${surfaceY - waveAmplitude} 200,${surfaceY + waveAmplitude} 225,${surfaceY} C250,${surfaceY - waveAmplitude} 275,${surfaceY + waveAmplitude} 300,${surfaceY}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.5"
                    />
                  </g>

                  <g className="wave-layer wave-front">
                    <path
                      className="wave-path"
                      d={`M0,${surfaceY} C25,${surfaceY - waveAmplitude} 50,${surfaceY + waveAmplitude} 75,${surfaceY} C100,${surfaceY - waveAmplitude} 125,${surfaceY + waveAmplitude} 150,${surfaceY} C175,${surfaceY - waveAmplitude} 200,${surfaceY + waveAmplitude} 225,${surfaceY} C250,${surfaceY - waveAmplitude} 275,${surfaceY + waveAmplitude} 300,${surfaceY} L300,200 L0,200 Z`}
                      fill={liquidColor}
                      opacity="0.85"
                    />
                    <path
                      className="wave-highlight"
                      d={`M0,${surfaceY} C25,${surfaceY - waveAmplitude} 50,${surfaceY + waveAmplitude} 75,${surfaceY} C100,${surfaceY - waveAmplitude} 125,${surfaceY + waveAmplitude} 150,${surfaceY} C175,${surfaceY - waveAmplitude} 200,${surfaceY + waveAmplitude} 225,${surfaceY} C250,${surfaceY - waveAmplitude} 275,${surfaceY + waveAmplitude} 300,${surfaceY}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
                    />
                  </g>

                  <g className="bubbles">
                    <circle cx="70" cy={surfaceY + 30} r="3" fill="rgba(255,255,255,0.25)" className="bubble bubble-1" />
                    <circle cx="120" cy={surfaceY + 45} r="2" fill="rgba(255,255,255,0.2)" className="bubble bubble-2" />
                    <circle cx="160" cy={surfaceY + 25} r="2.5" fill="rgba(255,255,255,0.22)" className="bubble bubble-3" />
                  </g>
                </g>
              </g>

              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
            </svg>

            <div className="productivity-text">
              <span className="productivity-percentage">{Math.round(displayPct)}%</span>
              <span className="productivity-hours">
                {formatHours(productiveHours)} focused
              </span>
            </div>
          </div>
        </div>
        <div className="productivity-label">Goal: {formatHours(targetHours)}</div>
      </div>
    </div>
  );
};

export default ProductivityMeter;
