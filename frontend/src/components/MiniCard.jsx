import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colorMap } from "../data/announcements";
export default function MiniCard({ item, animDelay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const cm = colorMap[item.color];

  const handleClick = () => {
    if (item.link) {
      window.open(item.link, "_blank");
    } else if (item.to) {
      navigate(item.to);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={`relative rounded-xl p-4 border card-glass cursor-pointer
                  transition-all duration-250 
                  ${hovered ? "-translate-y-0.5 shadow-card" : ""}`}
      style={{ animationDelay: `${animDelay}s`, animationFillMode: "both" }}
    >
      <div className="absolute top-0 right-0 w-[80px] h-[80px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 80% 20%, ${cm.glow} 0%, transparent 70%)` }} />

      {/* Number watermark */}
      <div className={`absolute bottom-2 right-3 font-display text-[32px] font-extrabold
                       opacity-[0.04] leading-none ${cm.text}`}>
        {String(item.id).padStart(2, "0")}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`font-body text-[8px] font-bold tracking-[0.13em] uppercase
                            px-2 py-0.5 rounded-full ${cm.pill}`}>
            {item.tag}
          </span>
          {item.points && (
            <span className={`font-display text-[9px] font-bold ml-auto ${cm.text}`}>
              +{item.points} pts
            </span>
          )}
        </div>

        <h3 className="font-display text-[12px] font-bold text-white leading-[1.35] mb-2 tracking-tight">
          {item.title}
        </h3>

        <p className="font-body text-[11px] text-white/35 leading-[1.55] line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/25">{item.date}</span>
          <span className={`font-body text-[10px] transition-all duration-200
                            ${hovered ? "translate-x-0.5 text-white/50" : "text-white/20"}`}>
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
