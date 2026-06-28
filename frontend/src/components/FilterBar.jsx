import React from "react";
import { filterOptions } from "../data/announcements";

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filterOptions.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`font-body text-[11px] font-medium px-4 py-1.5 rounded-full
                        border transition-all duration-200 cursor-pointer
                        ${isActive
                          ? "bg-violet-DEFAULT/20 border-violet-DEFAULT/40 text-violet-300"
                          : "bg-transparent border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/65"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
