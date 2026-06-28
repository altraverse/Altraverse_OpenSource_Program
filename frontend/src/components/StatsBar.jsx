import React from "react";
import { stats } from "../data/announcements";
export default function StatsBar() {
  return (
    <div className="grid grid-cols-4 border-t border-white/[0.07]"
         style={{ background: "#04060f" }}>
      {stats.map((s, i) => (
        <div key={i}
             className={`text-center py-6 hover:bg-white/[0.02] transition-colors duration-200
                         group cursor-default
                         ${i < stats.length - 1 ? "border-r border-white/[0.07]" : ""}`}>
          <div className="font-display text-[24px] font-extrabold text-violet-DEFAULT mb-1
                          group-hover:scale-105 transition-transform duration-200 inline-block">
            {s.number}
          </div>
          <div className="font-body text-[11px] text-white/30 tracking-[0.04em]">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
