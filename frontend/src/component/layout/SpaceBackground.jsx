import React, { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const layerFarRef = useRef(null);
  const layerMidRef = useRef(null);
  const layerNearRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (layerFarRef.current) {
        layerFarRef.current.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
      }
      if (layerMidRef.current) {
        layerMidRef.current.style.transform = `translate(${x * 14}px, ${y * 9}px)`;
      }
      if (layerNearRef.current) {
        layerNearRef.current.style.transform = `translate(${x * 24}px, ${y * 14}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="space-bg" aria-hidden="true">
      <div ref={layerFarRef} className="space-bg__layer space-bg__far">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
          <g className="space-bg__stars-a">
            {STARS_FAR.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" />
            ))}
          </g>
          <g className="space-bg__stars-b">
            {STARS_FAR_B.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" />
            ))}
          </g>
        </svg>
      </div>

      <div ref={layerMidRef} className="space-bg__layer space-bg__mid">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="sb-moon-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d6edff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#9fd0f5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#9fd0f5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sb-center-glow" cx="50%" cy="30%" r="55%">
              <stop offset="0%" stopColor="#1a3d3a" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1a3d3a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sb-planet-shade" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#5a47b8" stopOpacity="1" />
              <stop offset="100%" stopColor="#1c1450" stopOpacity="1" />
            </radialGradient>
          </defs>

          <ellipse cx="760" cy="220" rx="520" ry="240" fill="url(#sb-center-glow)" />

          <g stroke="#7a86c2" strokeWidth="0.8" opacity="0.7" fill="none">
            <line x1="980" y1="120" x2="1040" y2="100" />
            <line x1="1040" y1="100" x2="1100" y2="145" />
            <line x1="1100" y1="145" x2="1170" y2="120" />
            <line x1="1170" y1="120" x2="1240" y2="165" />
            <line x1="990" y1="195" x2="1040" y2="178" />
          </g>
          <g fill="#c7d2ff">
            <circle cx="980" cy="120" r="3" />
            <circle cx="1040" cy="100" r="3.6" />
            <circle cx="1100" cy="145" r="3" />
            <circle cx="1170" cy="120" r="3.8" />
            <circle cx="1240" cy="165" r="3" />
            <circle cx="990" cy="195" r="3" />
            <circle cx="1040" cy="178" r="3.2" />
          </g>


          <g className="space-bg__shoot-1">
            <line x1="0" y1="0" x2="70" y2="20" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="space-bg__shoot-2">
            <line x1="0" y1="0" x2="56" y2="16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div ref={layerNearRef} className="space-bg__layer space-bg__near">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="sb-hill-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101535" />
              <stop offset="100%" stopColor="#06091b" />
            </linearGradient>
            <linearGradient id="sb-hill-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1029" />
              <stop offset="100%" stopColor="#06091b" />
            </linearGradient>
            <linearGradient id="sb-hill-3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06091b" />
              <stop offset="100%" stopColor="#06091b" />
            </linearGradient>
          </defs>

          <path
            d="M0,720 C220,680 420,750 640,710 C820,680 980,730 1180,700 C1300,680 1400,705 1440,690 L1440,900 L0,900 Z"
            fill="url(#sb-hill-1)"
          />
          <path
            d="M0,755 C260,790 480,720 700,745 C900,768 1100,720 1300,745 C1360,752 1410,742 1440,748 L1440,900 L0,900 Z"
            fill="url(#sb-hill-2)"
          />
          <path
            d="M0,800 C300,775 560,815 820,795 C1040,778 1260,805 1440,785 L1440,900 L0,900 Z"
            fill="url(#sb-hill-3)"
          />

          <g stroke="#0a0e22" strokeWidth="2.5" strokeLinecap="round">
            <line x1="1010" y1="720" x2="1010" y2="760" />
            <line x1="1050" y1="730" x2="1050" y2="762" />
            <line x1="1090" y1="716" x2="1090" y2="756" />
          </g>
          <g fill="#0a0e22">
            <path d="M1010,700 L1024,720 L996,720 Z" />
            <path d="M1090,696 L1106,716 L1074,716 Z" />
          </g>
          <circle cx="1050" cy="733" r="5" fill="#0a0e22" />
        </svg>
      </div>
    </div>
  );
}

const STARS_FAR = [
  { x: 60, y: 70, r: 1.6 }, { x: 190, y: 35, r: 1.1 }, { x: 340, y: 110, r: 1.8 },
  { x: 420, y: 50, r: 1.1 }, { x: 520, y: 130, r: 1.4 }, { x: 610, y: 60, r: 1.1 },
  { x: 730, y: 95, r: 1.6 }, { x: 850, y: 40, r: 1.1 }, { x: 960, y: 145, r: 1.5 },
  { x: 1030, y: 65, r: 1.1 }, { x: 1130, y: 110, r: 1.7 }, { x: 1220, y: 45, r: 1.1 },
  { x: 80, y: 210, r: 1.1 }, { x: 220, y: 260, r: 1.5 }, { x: 390, y: 220, r: 1.1 },
  { x: 1190, y: 200, r: 1.4 }, { x: 1300, y: 260, r: 1.1 }, { x: 90, y: 330, r: 1.1 },
  { x: 30, y: 380, r: 1.4 }, { x: 1340, y: 340, r: 1.1 }, { x: 1400, y: 90, r: 1.3 },
  { x: 1380, y: 220, r: 1.1 },
];

const STARS_FAR_B = [
  { x: 130, y: 140, r: 1 }, { x: 270, y: 70, r: 1 }, { x: 460, y: 175, r: 1 },
  { x: 560, y: 35, r: 1 }, { x: 800, y: 150, r: 1 }, { x: 920, y: 80, r: 1 },
  { x: 1080, y: 185, r: 1 }, { x: 1260, y: 115, r: 1 }, { x: 160, y: 290, r: 1 },
  { x: 1100, y: 300, r: 1 }, { x: 700, y: 250, r: 1 }, { x: 1370, y: 150, r: 1 },
];
