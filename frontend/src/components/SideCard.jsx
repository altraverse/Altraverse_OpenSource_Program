import React, { useState } from "react";
import { colorMap } from "../data/announcements";

const ICONS = {
  violet: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.2l1.4 3.4H13l-3.5 2.6 1.3 4.3L7 9.4 3.2 11.5l1.3-4.3L1 4.6h4.6z" fill="#c4b5fd"/>
    </svg>
  ),
  rose: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.2" stroke="#fca5a5" strokeWidth="1.3"/>
      <path d="M7 4.5v3l1.8 1.8" stroke="#fca5a5" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  teal: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2.5" y="2.5" width="9" height="9" rx="2" stroke="#6ee7b7" strokeWidth="1.3"/>
      <path d="M5 7l1.8 2 3.2-3.2" stroke="#6ee7b7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  amber: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v3M7 10v3M1 7h3M10 7h3" stroke="#fcd34d" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  indigo: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3h8M3 7h8M3 11h5" stroke="#a5b4fc" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
};

export default function SideCard({ item, animDelay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const cm = colorMap[item.color];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-xl p-4 border transition-all duration-250 cursor-pointer
                  card-glass  
                  ${cm.border}
                  ${hovered ? "border-opacity-60 -translate-y-0.5 shadow-card" : "border-opacity-30"}`}
      style={{ animationDelay: `${animDelay}s`, animationFillMode: "both" }}
    >
      {/* Corner accent glow */}
      <div className="absolute top-0 right-0 w-[60px] h-[60px] rounded-tr-xl pointer-events-none"
           style={{ background: `radial-gradient(circle at 90% 10%, ${cm.glow} 0%, transparent 70%)` }} />

      <div className="flex items-start gap-3 relative z-10">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cm.icon}`}>
          {ICONS[item.color] || ICONS.violet}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`font-body text-[8px] font-bold tracking-[0.13em] uppercase
                              px-2 py-0.5 rounded-full ${cm.pill}`}>
              {item.tag}
            </span>
            {item.hot && (
              <span className="inline-flex items-center gap-1 font-body text-[9px] font-semibold text-orange-400">
                <span className="w-[4px] h-[4px] rounded-full bg-orange-400 animate-pulse-dot" />
                Hot
              </span>
            )}
          </div>

          <h3 className="font-display text-[12px] font-bold text-white leading-[1.35] mb-1.5 tracking-tight">
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-white/25 tracking-wide">
              {item.date}
            </span>
            {item.points && (
              <span className={`font-display text-[10px] font-bold px-2 py-0.5 rounded-lg ${cm.pts}`}>
                +{item.points} pts
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <span className={`text-lg flex-shrink-0 mt-0.5 transition-all duration-200
          ${hovered ? "text-white/50 translate-x-0.5" : "text-white/20"}`}>
          ›
        </span>
      </div>
    </div>
  );
}
