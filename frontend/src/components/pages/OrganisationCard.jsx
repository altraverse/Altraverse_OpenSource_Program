import React, { useState } from "react";

// Optimized color map using tailwind-compatible border/text utility values 
// and dynamic hex/rgba strings for seamless integration.
export const colorMap = {
  violet: {
    glow: "rgba(139, 92, 246, 0.12)",
    border: "hover:border-violet-500/30",
    text: "text-violet-400",
    pill: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.12)",
    border: "hover:border-emerald-500/30",
    text: "text-emerald-400",
    pill: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
  cyan: {
    glow: "rgba(6, 182, 212, 0.12)",
    border: "hover:border-cyan-500/30",
    text: "text-cyan-400",
    pill: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  }
};

export default function OrganisationCard({ item, animDelay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const cm = colorMap[item.color] || colorMap.violet;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-xl w-100 md:w-80 border border-white/[0.05] bg-[#0c102b]/40 backdrop-blur-md overflow-hidden cursor-pointer
                  transition-all duration-300 ease-out flex flex-col justify-between transform will-change-transform
                  ${cm.border} ${hovered ? "-translate-y-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] bg-[#0c102b]/70" : ""}`}
      style={{
        animationDelay: `${animDelay}s`,
        animationFillMode: "both"
      }}
    >
      {/* Dynamic Glow Mesh Layer - Blends flawlessly into dark background */}
      <div
        className="absolute top-0 right-0 w-[140px] h-[140px] pointer-events-none z-20 transition-opacity duration-300 group-hover:opacity-100 opacity-75"
        style={{ background: `radial-gradient(circle at 85% 15%, ${cm.glow} 0%, transparent 80%)` }}
      />

      {/* Number Watermark - Subtly calibrated text-contrast */}
      <div className={`absolute bottom-10 right-4 font-display text-[40px] font-extrabold
                       opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300 leading-none select-none z-0 ${cm.text}`}>
        {String(item.id).padStart(2, "0")}
      </div>

      {/* Top Section: Visual Banner Showcase */}
      <div className="relative h-28 w-full overflow-hidden border-b border-white/[0.04] bg-[#06091b]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out transform scale-100 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100 will-change-transform"
        />
        {/* Absolute vignette blending filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06091b]/90 via-[#06091b]/20 to-transparent" />
      </div>

      {/* Middle Section: Main Project Metadata */}
      <div className="relative z-10 p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Tag & Points Header Row */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-body text-[8px] font-bold tracking-[0.13em] uppercase
                              px-2 py-0.5 rounded-full ${cm.pill}`}>
              {item.tag}
            </span>
            {item.points && (
              <span className={`font-mono text-[9px] font-bold ml-auto tracking-wide ${cm.text}`}>
                +{item.points} PTS
              </span>
            )}
          </div>

          {/* Project Title */}
          <h3 className="font-display text-[14px] font-bold text-white/90 leading-snug mb-1.5 tracking-tight group-hover:text-white transition-colors duration-200">
            {item.title}
          </h3>

          {/* Project Description Container */}
          <p className="font-body text-[11px] text-white/40 leading-[1.6] line-clamp-2 mb-4 group-hover:text-white/50 transition-colors duration-200">
            {item.description}
          </p>
        </div>

        {/* Project Stats Highlight Panel */}
        <div className="grid grid-cols-2 gap-2 py-2 px-2.5 rounded-lg bg-white/[0.01] group-hover:bg-white/[0.02] border border-white/[0.03] group-hover:border-white/[0.06] mb-4 transition-all duration-300">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-yellow-500/50 transition-colors duration-300" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.434.764-.434.938 0l2.69 6.734 7.135.586c.476.039.666.623.313.954l-5.38 5.038 1.563 7.043c.104.468-.401.834-.81.595L12 20.13l-6.331 3.528c-.41.238-.91-.128-.81-.595l1.562-7.043-5.38-5.038c-.354-.33-.163-.915.313-.954l7.136-.586 2.69-6.734z" />
            </svg>
            <span className="font-mono text-[11px] font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300">
              {item.stars} <span className="text-[9px] text-white/30">stars</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/[0.04] pl-3">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-blue-400/50 transition-colors duration-300" viewBox="0 0 24 24">
              <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
              <path d="M18 15V9a4 4 0 0 0-4-4H9M6 9v6" />
            </svg>
            <span className="font-mono text-[11px] font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300">
              {item.forks} <span className="text-[9px] text-white/30">forks</span>
            </span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.02]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">{item.date}</span>
          <span className={`font-body text-[10px] font-medium transition-all duration-200
                            ${hovered ? "translate-x-0.5 text-white" : "text-white/30"}`}>
            View Repos →
          </span>
        </div>
      </div>
    </div>
  );
}
