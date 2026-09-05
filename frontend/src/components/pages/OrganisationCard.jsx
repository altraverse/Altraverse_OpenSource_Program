import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Hash string to number for deterministic styling
const hashString = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Preset palette combinations for dynamic SVG banners
const BANNER_THEMES = [
  { bg: "from-indigo-950 via-purple-900/40 to-[#06091b]", accent: "#8b5cf6", secondary: "#ec4899", grid: "rgba(139, 92, 246, 0.15)" },
  { bg: "from-emerald-950 via-teal-900/40 to-[#06091b]", accent: "#10b981", secondary: "#06b6d4", grid: "rgba(16, 185, 129, 0.15)" },
  { bg: "from-cyan-950 via-blue-900/40 to-[#06091b]", accent: "#06b6d4", secondary: "#3b82f6", grid: "rgba(6, 182, 212, 0.15)" },
  { bg: "from-fuchsia-950 via-pink-900/40 to-[#06091b]", accent: "#d946ef", secondary: "#8b5cf6", grid: "rgba(217, 70, 239, 0.15)" },
  { bg: "from-amber-950 via-orange-900/40 to-[#06091b]", accent: "#f59e0b", secondary: "#ef4444", grid: "rgba(245, 158, 11, 0.15)" },
  { bg: "from-rose-950 via-red-900/40 to-[#06091b]", accent: "#f43f5e", secondary: "#fb923c", grid: "rgba(244, 63, 94, 0.15)" },
  { bg: "from-violet-950 via-sky-900/40 to-[#06091b]", accent: "#6366f1", secondary: "#38bdf8", grid: "rgba(99, 102, 241, 0.15)" },
  { bg: "from-teal-950 via-emerald-900/40 to-[#06091b]", accent: "#14b8a6", secondary: "#a3e635", grid: "rgba(20, 184, 166, 0.15)" }
];

const PRESET_BANNERS = {
  "learnsphere": "/banners/learnsphere.png",
  "ai money mentor": "/banners/ai_money_mentor.png",
  "money mentor": "/banners/ai_money_mentor.png",
  "mentroid": "/banners/mentroid.png",
  "agritech": "/banners/agritech.png",
  "ember": "/banners/ember_renting.png",
  "smart city": "/banners/smart_city_analyzer.png",
  "city analyzer": "/banners/smart_city_analyzer.png"
};

const getTitleInitials = (title = "") => {
  const cleanTitle = title.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  const words = cleanTitle.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words.slice(0, 3).map(w => w[0]).join("").toUpperCase();
};

function ProjectBanner({ title = "", image = "", tag = "" }) {
  const lowerTitle = title.toLowerCase();

  // 1. Check if item has a unique custom image (not the default Unsplash placeholder)
  if (image && !image.includes("photo-1618005182384-a83a8bd57fbe") && !image.includes("smart_city_analyzer.png")) {
    return (
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 ease-out transform scale-100 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100"
      />
    );
  }

  // 2. Check for matched generated static banner
  const matchedKey = Object.keys(PRESET_BANNERS).find(key => lowerTitle.includes(key));
  if (matchedKey) {
    return (
      <img
        src={PRESET_BANNERS[matchedKey]}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 ease-out transform scale-100 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100"
      />
    );
  }

  // 3. Fallback: Dynamic Clean Procedural SVG Tech Banner for ANY of 20+ projects
  const hash = hashString(title);
  const theme = BANNER_THEMES[hash % BANNER_THEMES.length];
  const patternType = hash % 5;
  const initials = getTitleInitials(title);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${theme.bg} overflow-hidden flex items-center justify-between px-5 select-none`}>
      {/* Background SVG Geometric Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${hash}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={theme.grid} strokeWidth="0.8" />
          </pattern>
          <radialGradient id={`glow-${hash}`} cx="70%" cy="30%" r="60%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#grid-${hash})`} />
        <rect width="100%" height="100%" fill={`url(#glow-${hash})`} />

        {/* Dynamic Pattern Overlays based on Title Hash */}
        {patternType === 0 && (
          <g stroke={theme.accent} strokeWidth="1" fill="none" opacity="0.5">
            <circle cx="80%" cy="40%" r="35" strokeDasharray="4,4" />
            <circle cx="80%" cy="40%" r="20" />
            <line x1="0" y1="100%" x2="100%" y2="0" stroke={theme.secondary} strokeWidth="0.5" opacity="0.3" />
          </g>
        )}
        {patternType === 1 && (
          <g fill={theme.accent} opacity="0.3">
            <polygon points="220,10 260,30 220,50 180,30" />
            <polygon points="220,55 260,75 220,95 180,75" opacity="0.5" />
            <circle cx="50" cy="80" r="4" fill={theme.secondary} />
            <circle cx="70" cy="80" r="4" fill={theme.accent} />
          </g>
        )}
        {patternType === 2 && (
          <g stroke={theme.secondary} strokeWidth="1.2" fill="none" opacity="0.4">
            <path d="M 150 0 Q 200 60 300 30 T 400 100" />
            <path d="M 120 20 Q 180 80 280 50 T 380 120" stroke={theme.accent} />
          </g>
        )}
        {patternType === 3 && (
          <g fill={theme.accent} opacity="0.25">
            <rect x="70%" y="15%" width="40" height="40" rx="8" transform="rotate(15 220 30)" />
            <rect x="75%" y="45%" width="25" height="25" rx="4" transform="rotate(-20 240 60)" fill={theme.secondary} />
          </g>
        )}
        {patternType === 4 && (
          <g stroke={theme.accent} strokeWidth="0.8" opacity="0.4" fill="none">
            <line x1="20%" y1="0" x2="80%" y2="100%" strokeDasharray="2 4" />
            <line x1="40%" y1="0" x2="100%" y2="80%" strokeDasharray="2 4" stroke={theme.secondary} />
            <circle cx="85%" cy="50%" r="25" />
          </g>
        )}
      </svg>

      {/* Title Initials Monogram Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
            {tag || "PROJECT"}
          </span>
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent font-display">
            {initials}
          </span>
        </div>

        {/* Minimal Tech Icon Graphic */}
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner"
          style={{ backgroundColor: `${theme.accent}20` }}
        >
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
        </div>
      </div>
    </div>
  );
}

export default function OrganisationCard({ item, animDelay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const cm = colorMap[item.color] || colorMap.violet;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${item.id}`)}
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
        <ProjectBanner title={item.title} image={item.image} tag={item.tag} />
        {/* Absolute vignette blending filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06091b]/90 via-[#06091b]/20 to-transparent pointer-events-none" />
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
              {item.stars !== undefined && item.stars !== null ? item.stars : 0} <span className="text-[9px] text-white/30">stars</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/[0.04] pl-3">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-blue-400/50 transition-colors duration-300" viewBox="0 0 24 24">
              <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
              <path d="M18 15V9a4 4 0 0 0-4-4H9M6 9v6" />
            </svg>
            <span className="font-mono text-[11px] font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300">
              {item.forks !== undefined && item.forks !== null ? item.forks : 0} <span className="text-[9px] text-white/30">forks</span>
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
