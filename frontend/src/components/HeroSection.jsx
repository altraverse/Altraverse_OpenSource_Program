import React from "react";

export default function HeroSection() {
  return (
    <section className="relative pt-16 overflow-hidden" style={{ minHeight: 520 }}>
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-cosmic-hero" />
      <div className="absolute inset-0 starfield pointer-events-none" />

      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 60% 50% at 25% 40%, rgba(91,63,214,0.30) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 40% 50% at 80% 20%, rgba(34,211,168,0.10) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 30% 40% at 90% 70%, rgba(129,140,248,0.08) 0%, transparent 60%)" }} />

      {/* Crescent Moon */}
      <div className="absolute moon-crescent rounded-full"
           style={{ top: 88, right: 80, width: 58, height: 58 }} />

      {/* Shooting star */}
      <div className="absolute shooting-star"
           style={{ top: "22%", left: "40%", width: 64, height: 1.5 }} />
      {/* second faint one */}
      <div className="absolute shooting-star opacity-40"
           style={{ top: "14%", left: "62%", width: 36, height: 1 }} />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-0 flex items-start gap-12">
        {/* Left */}
        <div className="flex-1 ">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-violet-DEFAULT to-transparent" />
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-DEFAULT">
              Program Updates
            </span>
          </div>

          <h1 className="font-display text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.1]
                         text-white mb-5 tracking-tight">
            Code. Contribute.
            <br />
            <span className="gradient-text">Create Impact.</span>
          </h1>

          <p className="font-body text-[15px] leading-[1.8] text-white/45 max-w-[420px] mb-8 font-light">
            ASOC is India's largest open source program — connecting developers with
            real-world projects to learn, build, and grow together.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button className="font-display text-[13px] font-bold px-6 py-3 rounded-full
                               border-none text-white btn-violet shadow-violet-sm
                               hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
              Explore Projects
            </button>
            <button className="font-body text-[13px] font-medium px-6 py-3 rounded-full
                               border border-white/20 bg-white/[0.04] text-white/80
                               hover:border-white/35 hover:bg-white/[0.07] transition-all duration-200
                               flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C3.7 1 1 3.7 1 7s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2.2C9 3.2 10.8 5 10.8 7S9 10.8 7 10.8 3.2 9 3.2 7 5 3.2 7 3.2zm-1.5 2L7 5.5 8.5 7H7.5v2h-1V7H5z"
                      fill="rgba(255,255,255,0.7)" fillRule="evenodd"/>
              </svg>
              Join Community
            </button>
          </div>
        </div>

        {/* Right — Constellation SVG illustration */}
        <div className="w-[240px] flex-shrink-0   animate-float">
          <svg viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
            {/* Planet */}
            <circle cx="120" cy="120" r="58" fill="#100d4a" stroke="rgba(139,92,246,0.28)" strokeWidth="1"/>
            <circle cx="120" cy="120" r="44" fill="#0d0b3d" stroke="rgba(139,92,246,0.14)" strokeWidth="0.5"/>
            {/* Surface glow */}
            <ellipse cx="100" cy="100" rx="10" ry="8" fill="rgba(139,92,246,0.28)"/>
            <circle cx="104" cy="96" r="3" fill="rgba(200,185,255,0.45)"/>
            {/* Orbit ring */}
            <ellipse cx="120" cy="120" rx="75" ry="18" fill="none"
                     stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
            {/* Constellation lines */}
            <g stroke="rgba(200,216,240,0.18)" strokeWidth="0.8">
              <line x1="18" y1="16" x2="55" y2="44"/>
              <line x1="55" y1="44" x2="120" y2="20"/>
              <line x1="120" y1="20" x2="185" y2="50"/>
              <line x1="185" y1="50" x2="218" y2="28"/>
              <line x1="12" y1="76" x2="55" y2="44"/>
              <line x1="218" y1="28" x2="228" y2="78"/>
            </g>
            {/* Stars */}
            <circle cx="18"  cy="16"  r="2.2" fill="rgba(255,255,255,0.80)"/>
            <circle cx="55"  cy="44"  r="2"   fill="rgba(255,255,255,0.65)"/>
            <circle cx="120" cy="20"  r="2.8" fill="rgba(255,255,255,0.95)"/>
            <circle cx="185" cy="50"  r="2"   fill="rgba(255,255,255,0.65)"/>
            <circle cx="218" cy="28"  r="2"   fill="rgba(255,255,255,0.55)"/>
            <circle cx="12"  cy="76"  r="1.5" fill="rgba(255,255,255,0.50)"/>
            <circle cx="228" cy="78"  r="1.5" fill="rgba(255,255,255,0.50)"/>
            {/* Scattered mini stars */}
            <circle cx="6"   cy="42"  r="1"   fill="rgba(255,255,255,0.40)"/>
            <circle cx="200" cy="10"  r="1"   fill="rgba(255,255,255,0.50)"/>
            <circle cx="234" cy="120" r="1"   fill="rgba(255,255,255,0.35)"/>
            <circle cx="38"  cy="140" r="1"   fill="rgba(255,255,255,0.35)"/>
            <circle cx="160" cy="6"   r="1.2" fill="rgba(255,255,255,0.55)"/>
          </svg>
        </div>
      </div>

      {/* Silhouette landscape */}
      <div className="relative mt-10" style={{ height: 130 }}>
        <svg viewBox="0 0 1440 130" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="none"
             className="absolute bottom-0 left-0 w-full h-full block">
          {/* Back hills */}
          <path d="M0 130 Q220 30 440 80 Q660 128 880 42 Q1060 -8 1240 58 Q1360 100 1440 48 L1440 130 Z"
                fill="#0d1640"/>
          {/* Mid hills */}
          <path d="M0 130 Q160 78 320 104 Q520 130 720 68 Q900 28 1100 90 Q1260 130 1440 72 L1440 130 Z"
                fill="#0a1232"/>
          {/* Front ground */}
          <path d="M0 130 Q120 110 240 122 Q420 136 580 104 Q720 82 880 116 Q1040 138 1200 98 Q1340 72 1440 100 L1440 130 Z"
                fill="#06091b"/>

          {/* Left palm cluster */}
          <rect x="205" y="54" width="6"  height="68" fill="#0a1232"/>
          <path d="M197 54 Q208 28 219 54 Z" fill="#0a1232"/>
          <rect x="232" y="70" width="4"  height="54" fill="#0a1232"/>
          <path d="M225 70 Q234 52 243 70 Z" fill="#0a1232"/>
          <rect x="182" y="68" width="4"  height="58" fill="#0a1232"/>
          <path d="M175 68 Q184 50 193 68 Z" fill="#0a1232"/>

          {/* Right palm cluster */}
          <rect x="1218" y="34" width="7"  height="80" fill="#0d1640"/>
          <path d="M1208 34 Q1221 6 1234 34 Z" fill="#0d1640"/>
          <rect x="1250" y="55" width="5"  height="60" fill="#0d1640"/>
          <path d="M1243 55 Q1252 34 1261 55 Z" fill="#0d1640"/>
          <rect x="1192" y="50" width="4"  height="64" fill="#0d1640"/>
          <path d="M1186 50 Q1194 30 1202 50 Z" fill="#0d1640"/>

          {/* Grass tufts */}
          <path d="M48 128 Q52 116 56 128 M58 126 Q61 118 64 126" stroke="#0a1232" strokeWidth="2" fill="none"/>
          <path d="M1390 122 Q1394 112 1398 122" stroke="#0d1640" strokeWidth="2" fill="none"/>
        </svg>
      </div>
    </section>
  );
}
