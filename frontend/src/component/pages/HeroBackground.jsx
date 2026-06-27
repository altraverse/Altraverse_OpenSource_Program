import React from "react";

export default function HeroBackground() {
  return (
    <>
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{ background: "#070910" }}
      >
        <svg viewBox="0 0 1120 480" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06080f" /><stop offset="45%" stopColor="#0a1018" /><stop offset="100%" stopColor="#070910" />
            </linearGradient>
            <radialGradient id="p-glow" cx="50%" cy="10%" r="60%">
              <stop offset="0%" stopColor="#0f3d3a" stopOpacity="0.4" /><stop offset="100%" stopColor="#0f3d3a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="p-moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eaf6ff" stopOpacity="0.95" /><stop offset="35%" stopColor="#bfe3f5" stopOpacity="0.4" /><stop offset="100%" stopColor="#bfe3f5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="p-planetBody" cx="32%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#6a5ad6" /><stop offset="55%" stopColor="#3a2f8a" /><stop offset="100%" stopColor="#161244" />
            </radialGradient>
            <linearGradient id="p-hillFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c2454" /><stop offset="100%" stopColor="#141a3e" />
            </linearGradient>
            <linearGradient id="p-hillMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141a42" /><stop offset="100%" stopColor="#0d1230" />
            </linearGradient>
            <linearGradient id="p-hillNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c1130" /><stop offset="100%" stopColor="#080a20" />
            </linearGradient>
          </defs>

          <rect width="1120" height="480" fill="url(#p-sky)" />
          <ellipse cx="560" cy="40" rx="560" ry="130" fill="url(#p-glow)" />

          <g className="p-twinkle-a" fill="#fff">
            <circle cx="40" cy="25" r="1.4" opacity="0.85" /><circle cx="110" cy="50" r="0.9" opacity="0.5" />
            <circle cx="190" cy="20" r="1.2" opacity="0.75" /><circle cx="260" cy="55" r="0.9" opacity="0.5" />
            <circle cx="330" cy="22" r="1.3" opacity="0.8" /><circle cx="410" cy="48" r="0.9" opacity="0.5" />
            <circle cx="500" cy="18" r="1.1" opacity="0.7" /><circle cx="570" cy="50" r="0.9" opacity="0.5" />
            <circle cx="650" cy="22" r="1.3" opacity="0.8" /><circle cx="730" cy="55" r="0.9" opacity="0.5" />
            <circle cx="800" cy="20" r="1.2" opacity="0.75" /><circle cx="870" cy="48" r="0.9" opacity="0.5" />
            <circle cx="940" cy="25" r="1.3" opacity="0.8" /><circle cx="60" cy="90" r="0.8" opacity="0.4" />
            <circle cx="280" cy="95" r="0.8" opacity="0.4" /><circle cx="450" cy="85" r="0.8" opacity="0.4" />
            <circle cx="20" cy="180" r="1" opacity="0.5" /><circle cx="80" cy="240" r="0.9" opacity="0.4" />
          </g>
          <g className="p-twinkle-b" fill="#fff" opacity="0.4">
            <circle cx="160" cy="110" r="0.7" /><circle cx="380" cy="130" r="0.7" />
            <circle cx="60" cy="320" r="0.8" /><circle cx="160" cy="280" r="0.7" />
          </g>

          <g className="p-shoot-1"><line x1="0" y1="0" x2="60" y2="17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></g>

          <g stroke="#7a86c2" strokeWidth="0.7" opacity="0.65" fill="none">
            <line x1="620" y1="65" x2="675" y2="48" /><line x1="675" y1="48" x2="725" y2="78" />
            <line x1="725" y1="78" x2="785" y2="55" />
          </g>
          <g fill="#c7d2ff">
            <circle cx="620" cy="65" r="2.4" /><circle cx="675" cy="48" r="2.8" />
            <circle cx="725" cy="78" r="2.4" /><circle cx="785" cy="55" r="2.6" />
          </g>

          <circle cx="1050" cy="45" r="32" fill="url(#p-moonGlow)" />
          <circle cx="1050" cy="45" r="18" fill="#06080f" />
          <circle cx="1050" cy="45" r="18" fill="none" stroke="#eaf6ff" strokeWidth="2.5" />

          <g transform="translate(880,150)">
            <ellipse cx="0" cy="0" rx="62" ry="16" fill="none" stroke="#8d7ad6" strokeWidth="1" strokeDasharray="3,5" opacity="0.6" />
            <circle cx="0" cy="0" r="42" fill="url(#p-planetBody)" />
            <circle cx="-14" cy="-12" r="6" fill="#b9a6ff" opacity="0.85" />
            <ellipse cx="0" cy="0" rx="62" ry="16" fill="none" stroke="#8d7ad6" strokeWidth="1" strokeDasharray="3,5" opacity="0.35" transform="rotate(180)" />
          </g>

          <g fill="#fff" opacity="0.35">
            <circle cx="950" cy="200" r="1" /><circle cx="1000" cy="240" r="0.8" />
          </g>

          <path d="M0,320 C160,295 320,335 480,315 C620,298 760,325 920,305 C1000,295 1070,310 1120,300 L1120,480 L0,480 Z" fill="url(#p-hillFar)" />
          <path d="M0,355 C200,338 400,368 600,348 C780,330 940,360 1120,340 L1120,480 L0,480 Z" fill="url(#p-hillMid)" />
          <path d="M0,395 C260,380 520,408 780,390 C920,380 1040,398 1120,385 L1120,480 L0,480 Z" fill="url(#p-hillNear)" />

          <g stroke="#070910" strokeWidth="2.2" strokeLinecap="round">
            <line x1="260" y1="350" x2="260" y2="382" /><line x1="295" y1="358" x2="295" y2="386" />
            <line x1="980" y1="345" x2="980" y2="380" /><line x1="1015" y1="354" x2="1015" y2="384" />
          </g>
          <g fill="#070910">
            <path d="M260,330 L272,348 L248,348 Z" /><path d="M295,338 L307,354 L283,354 Z" />
            <path d="M980,325 L994,344 L966,344 Z" /><path d="M1015,334 L1027,350 L1003,350 Z" />
          </g>
        </svg>
      </div>

      <style>{`
        .p-twinkle-a{animation:pTwA 4s ease-in-out infinite alternate;}
        .p-twinkle-b{animation:pTwB 5.5s ease-in-out infinite alternate;}
        @keyframes pTwA{0%{opacity:0.5;}100%{opacity:1;}}
        @keyframes pTwB{0%{opacity:0.25;}100%{opacity:0.6;}}
        .p-shoot-1{transform:translate(700px,90px);opacity:0;animation:pShoot 7s linear infinite;}
        @keyframes pShoot{0%{transform:translate(660px,70px);opacity:0;}3%{opacity:1;}12%{transform:translate(900px,170px);opacity:0;}100%{opacity:0;}}
      `}</style>
    </>
  );
}
