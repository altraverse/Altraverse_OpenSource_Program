import React from "react";

export default function FeaturedCard({ item }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shimmer-border spotlight-card
                    flex flex-col h-full shadow-violet-lg ">

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
           style={{ background: "radial-gradient(circle at 80% 15%, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
           style={{ background: "radial-gradient(circle at 20% 85%, rgba(34,211,168,0.10) 0%, transparent 65%)" }} />

      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* ── Live Task Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Clean live indicator: small ring + inner dot, no heavy blur */}
            <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 rounded-full live-ring"
                   style={{ background: "rgba(139,92,246,0.12)", border: "1.5px solid rgba(139,92,246,0.40)" }} />
              <div className="w-2 h-2 rounded-full relative z-10"
                   style={{ background: "#8b5cf6", boxShadow: "0 0 6px rgba(139,92,246,0.8)" }} />
            </div>
            <div>
              <div className="font-mono text-[9px] font-semibold tracking-[0.18em] uppercase"
                   style={{ color: "#a78bfa" }}>
                Live Task
              </div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                {item.date} · {item.time}
              </div>
            </div>
          </div>

          {/* Featured badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
               style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.30)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                 style={{ background: "#a78bfa" }} />
            <span className="font-mono text-[8px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: "#c4b5fd" }}>
              Featured
            </span>
          </div>
        </div>

        {/* ── Title: DM Sans bold (body font), not Syne extrabold ── */}
        <h2 className="font-body font-bold text-white mb-4"
            style={{ fontSize: 21, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {item.title}
        </h2>

        {/* ── Description ── */}
        <p className="font-body text-[13px] leading-[1.75] mb-6 font-light line-clamp-3"
           style={{ color: "rgba(255,255,255,0.44)" }}>
          {item.description}
        </p>

        {/* ── Points box: compact, auto width, no huge empty space ── */}
        <div className="inline-flex items-center gap-4 self-start rounded-xl px-5 py-3 mb-6"
             style={{
               background: "rgba(255,255,255,0.04)",
               border: "1px solid rgba(139,92,246,0.20)"
             }}>
          <span className="font-display font-bold tabular-nums leading-none"
                style={{ fontSize: 44, color: "#8b5cf6", letterSpacing: "-0.03em" }}>
            {item.points}
          </span>
          <div className="border-l border-white/10 pl-4">
            <div className="font-body font-medium text-[12px] text-white/65">points</div>
            <div className="font-body text-[11px] font-light mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>
              on completion
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* ── CTA row ── */}
        <div className="flex items-center gap-3">
          <a href={item.link || "#"} target="_blank" rel="noopener noreferrer"
             className="flex-1 text-center font-body font-semibold text-[13px] py-3.5 rounded-full
                        text-white btn-violet shadow-violet-sm
                        hover:opacity-90 transition-all duration-200 cursor-pointer">
            Start Task →
          </a>
          <button className="w-10 h-10 rounded-full flex items-center justify-center
                              border transition-all duration-200 hover:border-white/25"
                  style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
              <path d="M7 4.5v3l1.8 1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-4 pt-4"
             style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                 style={{ background: "rgba(139,92,246,0.28)" }}>
              <span className="font-mono text-[7px] font-bold" style={{ color: "#c4b5fd" }}>A</span>
            </div>
            <span className="font-body text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>
              Posted by{" "}
              <strong className="font-medium" style={{ color: "rgba(255,255,255,0.52)" }}>
                {item.author}
              </strong>
            </span>
          </div>
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.20)" }}>
            #{String(item.id).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
