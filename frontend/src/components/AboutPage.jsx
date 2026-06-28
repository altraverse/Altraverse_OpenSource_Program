import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import Navbar from "../component/layout/Navbar";
import Footer from "./footer";
import MeetTeamHero from "./MeetTeamHero";
import TeamGrid from "./TeamGrid";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────── */
const T = {
  bg:       "#080810",
  surface:  "#0e0e1a",
  card:     "#13131f",
  cardHigh: "#181830",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(139,92,246,0.45)",
  textPri:  "#ffffff",
  textSec:  "rgba(255,255,255,0.45)",
  textMut:  "rgba(255,255,255,0.25)",
  violet:   "#7c3aed",
  indigo:   "#4f46e5",
  cyan:     "#06b6d4",
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES — injected once
   ───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .aoc-root { font-family: 'Inter', system-ui, sans-serif; }
  .grad-text {
    background: linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-text-warm {
    background: linear-gradient(135deg, #c084fc 0%, #818cf8 60%, #67e8f9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glow-btn {
    transition: box-shadow 0.25s, transform 0.2s;
  }
  .glow-btn:hover {
    box-shadow: 0 0 48px rgba(124,58,237,0.55);
    transform: translateY(-2px);
  }
  .ghost-btn {
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .ghost-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(139,92,246,0.5);
    transform: translateY(-2px);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

/* ─────────────────────────────────────────────
   PARTICLES
   ───────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.5 + 0.8,
  dur: Math.random() * 9 + 7,
  delay: Math.random() * 5,
  op: Math.random() * 0.35 + 0.08,
}));

function Particles({ count = 20, color = "139,92,246" }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.slice(0, count).map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.r * 2,
            height: p.r * 2,
            background: `rgba(${color},${p.op})`,
          }}
          animate={{ y: [-14, 14, -14], opacity: [p.op, p.op * 0.25, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED NUMBER — smoother, staggered count-up
   ───────────────────────────────────────────── */
function AnimatedNumber({ raw, suffix = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 38, damping: 22, mass: 0.9 });
  const [disp, setDisp] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => mv.set(raw), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, mv, raw, delay]);

  useEffect(() =>
    spring.on("change", (v) => {
      const n =
        raw >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M"
        : raw >= 1_000   ? Math.round(v / 1_000) + "K"
        : Math.round(v).toString();
      setDisp(n);
    }), [spring, raw]);

  return <span ref={ref}>{disp}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   TILT CARD
   ───────────────────────────────────────────── */
function TiltCard({ children, intensity = 10, className = "" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [intensity, -intensity]);
  const ry = useTransform(mx, [-0.5, 0.5], [-intensity, intensity]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION DIVIDER
   ───────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center max-w-6xl mx-auto px-6">
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL ICON MAP
   ───────────────────────────────────────────── */
const SOCIAL_ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.1.83-.26.83-.57l-.02-2.24c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07C3.68 21.62 2.15 20.08 2 16.85 1.94 15.58 1.93 15.2 1.93 12c0-3.2.01-3.58.07-4.85C2.15 3.92 3.68 2.38 6.15 2.23 7.42 2.17 7.8 2.16 12 2.16zm0-2.16c-3.26 0-3.67.01-4.95.07C2.7.22.22 2.7.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.15 4.36 2.62 6.83 6.98 6.98C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.01 4.95-.07 4.36-.15 6.83-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.15-4.35-2.62-6.83-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const STATS = [
  {
    raw: 50000, suffix: "+", label: "Contributors",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    from: "#7c3aed", to: "#4f46e5",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    raw: 500000, suffix: "+", label: "Pull Requests",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>,
    from: "#2563eb", to: "#0891b2",
    glow: "rgba(37,99,235,0.3)",
  },
  {
    raw: 1000, suffix: "+", label: "Projects",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    from: "#059669", to: "#0d9488",
    glow: "rgba(5,150,105,0.3)",
  },
  {
    raw: 5000000, suffix: "+", label: "Lines of Code",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>,
    from: "#d97706", to: "#dc2626",
    glow: "rgba(217,119,6,0.3)",
  }
];

const VALUES = [
  { emoji: "⚡", title: "Learn by Building",   desc: "Contribute to real codebases used in production. No toy projects.", accent: "#7c3aed" },
  { emoji: "🔓", title: "Open Source First",   desc: "Everything we build is open. Transparency and trust at the core.", accent: "#2563eb" },
  { emoji: "🤝", title: "Community Driven",    desc: "Decisions made by contributors. You shape the program.", accent: "#059669" },
  { emoji: "🛠️", title: "Real World Projects", desc: "Repos with active users — your PRs ship to real people.", accent: "#d97706" },
  { emoji: "🌏", title: "Global Collaboration",desc: "Work with devs across 40+ countries on shared problems.", accent: "#db2777" },
  { emoji: "📈", title: "Career Growth",       desc: "A profile that speaks louder than any resume line.", accent: "#6366f1" },
];

/* Avatar placeholder using DiceBear initials — deterministic, no external image needed */
const avatar = (seed, size = 160) =>
  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}&radius=50&size=${size}&backgroundType=gradientLinear&backgroundColor=7c3aed,4f46e5`;

const TEAM = {
  founders: [
    {
      name: "Aryan Sharma", role: "Founder",
      bio: "Visionary architect of India's largest open source movement. One commit, one community at a time.",
      skills: ["Strategy", "Open Source", "Community"],
      socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" },
      from: "#7c3aed", to: "#4f46e5",
    },
    {
      name: "Priya Mehta", role: "Co-Founder",
      bio: "Engineering leader who turned ASOC's technical vision into a platform thousands rely on.",
      skills: ["Engineering", "Leadership", "DevRel"],
      socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" },
      from: "#0891b2", to: "#2563eb",
    },
  ],
  sections: [
    {
      label: "Core Leadership",
      members: [
        { name: "Sneha Patel",  role: "Tech Lead",        bio: "Architect of ASOC's core infra and open source toolchain.",        skills: ["Go", "K8s", "Architecture"],  socials: { github: "#", linkedin: "#", twitter: "#" }, from: "#d97706", to: "#dc2626" },
        { name: "Rohan Das",    role: "Community Manager", bio: "The human engine keeping 50K+ contributors engaged and happy.",      skills: ["Growth", "Events", "Content"],  socials: { github: "#", linkedin: "#", instagram: "#" }, from: "#059669", to: "#0d9488" },
        { name: "Vikram Nair",  role: "Design Lead",       bio: "Pixel-perfect UX for every surface of the ASOC platform.",         skills: ["Figma", "Motion", "Systems"],   socials: { linkedin: "#", instagram: "#" }, from: "#db2777", to: "#9333ea" },
      ],
    },
    {
      label: "Tech Team",
      members: [
        { name: "Aditya Kumar",  role: "Backend Engineer",  bio: "Scales ASOC APIs to handle millions of monthly requests.",   skills: ["Node.js", "PostgreSQL"],  socials: { github: "#", linkedin: "#" }, from: "#6366f1", to: "#8b5cf6" },
        { name: "Meera Singh",   role: "Frontend Dev",      bio: "Ships the interfaces contributors and maintainers love.",     skills: ["React", "TypeScript"],    socials: { github: "#", linkedin: "#" }, from: "#7c3aed", to: "#4f46e5" },
        { name: "Karan Joshi",   role: "DevOps Engineer",   bio: "Zero-downtime deployments across ASOC's global infra.",       skills: ["Docker", "CI/CD"],        socials: { github: "#", linkedin: "#" }, from: "#2563eb", to: "#0891b2" },
      ],
    },
    {
      label: "Community Team",
      members: [
        { name: "Divya Rao",    role: "Community Lead",    bio: "Runs ASOC's flagship events and mentorship programs.",        skills: ["Outreach", "Programs"],   socials: { linkedin: "#", instagram: "#", twitter: "#" }, from: "#059669", to: "#0d9488" },
        { name: "Sahil Gupta",  role: "Discord Mod",       bio: "Keeps conversations productive and contributors supported.",  skills: ["Moderation", "Support"],  socials: { github: "#", linkedin: "#" }, from: "#d97706", to: "#dc2626" },
      ],
    },
    {
      label: "Operations Team",
      members: [
        { name: "Tanvi Kapoor", role: "Operations Lead",   bio: "Keeps ASOC's programs, partners, and budgets running on time.", skills: ["Ops", "Partnerships"],  socials: { linkedin: "#" }, from: "#0891b2", to: "#2563eb" },
        { name: "Yash Verma",   role: "Program Coordinator", bio: "Coordinates cohorts, schedules, and contributor onboarding.", skills: ["Logistics", "Onboarding"], socials: { linkedin: "#", github: "#" }, from: "#6366f1", to: "#8b5cf6" },
      ],
    },
    {
      label: "Research Team",
      members: [
        { name: "Ishaan Bhatt", role: "Research Lead",     bio: "Studies open-source contribution patterns to improve the program.", skills: ["Data", "OSS Research"], socials: { github: "#", linkedin: "#" }, from: "#db2777", to: "#9333ea" },
        { name: "Naina Verma",  role: "Research Analyst",  bio: "Turns contributor feedback into roadmap decisions.",             skills: ["Analytics", "Surveys"], socials: { linkedin: "#" }, from: "#d97706", to: "#dc2626" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   NODE DOT — small graph marker used on team cards
   (encodes "the network" signature concept)
   ───────────────────────────────────────────── */
function NodeDot({ color = "#a78bfa", size = 6 }) {
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: color, boxShadow: `0 0 8px ${color}` }}
    />
  );
}

/* ─────────────────────────────────────────────
   FOUNDER LINK — animated energy pulse connecting
   the two root nodes (founder cards)
   ───────────────────────────────────────────── */
function FounderLink() {
  return (
    <div className="hidden sm:flex items-center justify-center px-2" aria-hidden>
      <svg width="64" height="2" viewBox="0 0 64 2" className="overflow-visible">
        <line x1="0" y1="1" x2="64" y2="1" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />
        <motion.circle
          r="2.5"
          fill="#a78bfa"
          cy="1"
          animate={{ cx: [0, 64, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FOUNDER CARD  (large, side-by-side "root nodes")
   ───────────────────────────────────────────── */
function FounderCard({ member, align = "left" }) {
  const [hov, setHov] = useState(false);

  return (
    <TiltCard intensity={4} className="h-full">
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        className="relative rounded-[28px] overflow-hidden h-full flex flex-col"
        style={{ background: T.cardHigh, border: `1px solid ${T.border}` }}
        animate={{
          boxShadow: hov
            ? `0 0 0 1px ${member.from}90, 0 30px 90px ${member.from}28, 0 0 120px ${member.from}18`
            : `0 0 0 1px ${T.border}, 0 20px 60px rgba(0,0,0,0.35)`,
          y: hov ? -4 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* rotating conic gradient ring */}
        <motion.div
          aria-hidden
          className="absolute -inset-[1px] rounded-[28px] pointer-events-none opacity-0"
          style={{
            background: `conic-gradient(from 0deg, ${member.from}, transparent 30%, ${member.to}, transparent 70%, ${member.from})`,
          }}
          animate={{ opacity: hov ? 0.5 : 0, rotate: hov ? 360 : 0 }}
          transition={{ opacity: { duration: 0.3 }, rotate: { duration: 6, repeat: Infinity, ease: "linear" } }}
        />
        <div className="absolute inset-[1px] rounded-[27px]" style={{ background: T.cardHigh }} />

        {/* mesh wash */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 90% 70% at ${align === "left" ? "20%" : "80%"} 0%, ${member.from}28 0%, transparent 60%)` }}
          animate={{ opacity: hov ? 1 : 0.55 }}
          transition={{ duration: 0.4 }}
        />
        {/* subtle noise texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 flex flex-col p-8 sm:p-10 gap-6 h-full">
          {/* top row: role badge + node id */}
          <div className="flex items-center justify-between">
            <div
              className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase text-white"
              style={{ background: `linear-gradient(135deg, ${member.from}, ${member.to})`, boxShadow: `0 4px 20px ${member.from}55` }}
            >
              {member.role}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: T.textMut }}>
              <NodeDot color={member.from} />
              root_node
            </div>
          </div>

          {/* image + name row */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <motion.div
                aria-hidden
                className="absolute -inset-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${member.from}, ${member.to})`, filter: "blur(22px)" }}
                animate={{ opacity: hov ? 0.75 : 0.4, scale: hov ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden"
                style={{ padding: 2.5, background: `linear-gradient(135deg, ${member.from}, ${member.to})` }}
                animate={{ scale: hov ? 1.04 : 1, rotate: hov ? 2 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={avatar(member.name, 160)}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                  style={{ background: "#0e0e1a" }}
                />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px]" style={{ borderColor: T.cardHigh }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[24px] sm:text-[26px] font-black text-white tracking-tight leading-tight">{member.name}</h3>
              <p className="text-[12.5px] mt-1 font-light" style={{ color: T.textMut }}>connected since founding commit</p>
            </div>
          </div>

          <p className="text-[14px] leading-relaxed font-light" style={{ color: T.textSec }}>{member.bio}</p>

          {/* skills */}
          <div className="flex flex-wrap gap-2">
            {member.skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: "rgba(255,255,255,0.05)", color: T.textSec, border: `1px solid ${T.border}` }}>
                {s}
              </span>
            ))}
          </div>

          {/* socials */}
          <div className="flex gap-2.5 mt-auto pt-2">
            {Object.entries(member.socials).map(([type, href]) => (
              <motion.a
                key={type} href={href}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ color: T.textSec, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${member.from}26`; e.currentTarget.style.borderColor = `${member.from}80`; e.currentTarget.style.boxShadow = `0 0 18px ${member.from}55`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = T.textSec; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                {SOCIAL_ICONS[type]}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─────────────────────────────────────────────
   TEAM MEMBER CARD  (standard, bento-aware)
   ───────────────────────────────────────────── */
function MemberCard({ member }) {
  const [hov, setHov] = useState(false);

  return (
    <TiltCard intensity={8} className="h-full">
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        className="relative rounded-2xl overflow-hidden h-full flex flex-col"
        style={{ background: T.card, border: `1px solid ${T.border}` }}
        animate={{
          y: hov ? -7 : 0,
          boxShadow: hov ? `0 0 0 1px ${member.from}60, 0 20px 56px rgba(0,0,0,0.45)` : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* animated gradient border line — sweeps on hover */}
        <div className="relative h-[3px] w-full overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${member.from}, ${member.to})` }} />
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}
            animate={{ x: hov ? ["-40%", "140%"] : "-40%" }}
            transition={{ duration: 1.1, repeat: hov ? Infinity : 0, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 flex flex-col p-5 gap-4 h-full">
          {/* Avatar + badge row */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-14 h-14 rounded-2xl overflow-hidden"
                style={{
                  padding: 1.5,
                  background: `linear-gradient(135deg, ${member.from}, ${member.to})`,
                  boxShadow: `0 0 20px ${member.from}44`,
                }}
              >
                <motion.img
                  src={avatar(member.name, 80)}
                  alt={member.name}
                  className="w-full h-full rounded-xl object-cover"
                  style={{ background: "#0e0e1a" }}
                  animate={{ scale: hov ? 1.12 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-0.5 min-w-0">
              <span
                className="self-start px-2 py-0.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase text-white"
                style={{ background: `linear-gradient(135deg, ${member.from}, ${member.to})` }}
              >
                {member.role}
              </span>
              <div className="flex items-center gap-1.5">
                <NodeDot color={member.from} size={5} />
                <h3 className="text-[15px] font-bold text-white leading-tight truncate">{member.name}</h3>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-[12px] leading-relaxed flex-1 font-light" style={{ color: T.textSec }}>
            {member.bio}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: "rgba(255,255,255,0.04)", color: T.textMut, border: `1px solid ${T.border}` }}>
                {s}
              </span>
            ))}
          </div>

          {/* Socials */}
          <motion.div
            className="flex gap-1.5"
            animate={{ opacity: hov ? 1 : 0.35, y: hov ? 0 : 3 }}
            transition={{ duration: 0.22 }}
          >
            {Object.entries(member.socials).map(([type, href]) => (
              <a
                key={type} href={href}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ color: T.textMut, border: `1px solid ${T.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = T.textMut; e.currentTarget.style.background = "transparent"; }}
              >
                {SOCIAL_ICONS[type]}
              </a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD — premium glass card for "By The
   Numbers" with subtle, minimal hover interactions.
   ───────────────────────────────────────────── */
function StatCard({ stat: s, delay = 0 }) {
  const [hov, setHov] = useState(false);

  return (
    <TiltCard intensity={7} className="h-full">
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        className="relative rounded-2xl overflow-hidden h-full group cursor-default"
        style={{
          background: "rgba(19,19,31,0.55)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${T.border}`,
        }}
        animate={{
          y: hov ? -2 : 0,
          borderColor: hov ? "rgba(255,255,255,0.15)" : T.border,
          backgroundColor: hov ? "rgba(25,25,38,0.6)" : "rgba(19,19,31,0.55)",
          boxShadow: hov
            ? "0 12px 24px -6px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(0,0,0,0.25)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="absolute inset-[1px] rounded-2xl" style={{ background: "transparent" }} />

        {/* static top accent, always visible */}
        <div className="relative h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${s.from}, ${s.to})` }} />

        <div className="relative z-10 p-6">
          {/* icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-white"
            style={{
              background: `linear-gradient(135deg, ${s.from}35, ${s.to}35)`,
              border: `1px solid ${s.from}45`,
              boxShadow: `0 0 12px ${s.glow}`
            }}
          >
            {s.icon}
          </div>

          {/* number */}
          <div className="relative mb-1">
            <div
              className="relative font-black tracking-tight text-white"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              <AnimatedNumber raw={s.raw} suffix={s.suffix} delay={delay} />
            </div>
          </div>

          <div className="text-[13px] font-medium tracking-wide" style={{ color: T.textSec }}>
            {s.label}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─────────────────────────────────────────────
   STAGGERED REVEAL WRAPPER
   ───────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL
   ───────────────────────────────────────────── */
function SectionLabel({ text }) {
  return (
    <div className="inline-flex items-center gap-2.5 mb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
      <span className="font-mono text-[10.5px] font-bold tracking-[0.22em] uppercase text-violet-400">{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div
      className="aoc-root"
      style={{ background: T.bg, minHeight: "100vh", color: T.textPri }}
    >
      <style>{GLOBAL_CSS}</style>
      <Navbar />

      {/* ══════════════════════════════════════
          1. HERO
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: 80, minHeight: 620 }}>
        <Particles count={20} />

        {/* Orb cluster */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", top: "-10%", left: "15%",  width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 68%)" }} />
          <div style={{ position: "absolute", top: "20%",  right: "-5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 68%)" }} />
          <div style={{ position: "absolute", bottom: 0,   left: "-8%",  width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 96 }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Eyebrow pill */}
            <div
              className="inline-flex items-center gap-2.5 mb-7 px-4 py-2 rounded-full"
              style={{ border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.025)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400">
                About ASOC — India's Largest OSS Program
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-black leading-[1.04] tracking-[-0.025em] text-white mb-6"
              style={{ fontSize: "clamp(40px, 6.5vw, 84px)" }}
            >
              Building the future<br />
              of{" "}
              <span className="grad-text">Open Source</span>
              <br />
              in India.
            </h1>

            <p
              className="font-light leading-[1.8] mb-10 max-w-[520px]"
              style={{ fontSize: 17, color: T.textSec }}
            >
              ASOC connects developers with real-world projects — helping them learn,
              build, and leave a lasting mark on the global developer community.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                className="glow-btn px-8 py-3.5 rounded-full font-bold text-[14px] text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                Start Contributing →
              </button>
              <button
                className="ghost-btn px-8 py-3.5 rounded-full font-bold text-[14px]"
                style={{ border: `1px solid ${T.border}`, color: T.textSec, background: "transparent" }}
              >
                View Projects
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          2. MEET OUR TEAM HERO
          Curved floating cards + GSAP ScrollTrigger
          horizontal parallax movement
         ══════════════════════════════════════ */}
      <MeetTeamHero />

      {/* ══════════════════════════════════════
          2b. TEAM GRID
          4-column premium dark grid with
          GSAP staggered reveals
         ══════════════════════════════════════ */}
      <TeamGrid />

      <Divider />

      {/* ══════════════════════════════════════
          3. STATS — "By The Numbers"
          Glass cards, animated gradient borders,
          glow-pulsing numbers, staggered reveal.
         ══════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* ambient glow unique to this section */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", top: "10%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <SectionLabel text="By The Numbers" />
              <h2
                className="font-black tracking-tight text-white"
                style={{ fontSize: "clamp(30px, 4.5vw, 56px)" }}
              >
                The scale of our <span className="grad-text">impact</span>
              </h2>
              <p className="font-light mt-4 max-w-md mx-auto" style={{ fontSize: 15, color: T.textSec }}>
                Every metric here is a person who showed up, opened a PR, and kept going.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <StatCard stat={s} delay={i * 0.06} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          4. WHY ASOC
         ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — sticky label + headline + desc */}
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <SectionLabel text="Why ASOC" />
                <h2
                  className="font-black tracking-tight text-white mb-5 leading-tight"
                  style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
                >
                  A platform built<br />
                  for <span className="grad-text">builders</span>
                </h2>
                <p className="font-light leading-[1.8] mb-8" style={{ fontSize: 16, color: T.textSec }}>
                  From your first issue to your first maintainer badge —
                  ASOC is the launchpad India's open source developers have been waiting for.
                </p>
                <button
                  className="glow-btn px-7 py-3 rounded-full font-bold text-[13px] text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                >
                  Explore the Program →
                </button>
              </div>
            </Reveal>

            {/* Right — feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <TiltCard intensity={10} className="h-full">
                    <motion.div
                      className="relative rounded-2xl overflow-hidden h-full group"
                      style={{ background: T.card, border: `1px solid ${T.border}` }}
                      whileHover={{ borderColor: v.accent + "55", y: -4, boxShadow: `0 0 0 1px ${v.accent}44, 0 8px 32px rgba(0,0,0,0.3)` }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse 120% 80% at 20% 20%, ${v.accent}15 0%, transparent 65%)` }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative z-10 p-5">
                        <div className="text-2xl mb-3">{v.emoji}</div>
                        <h3 className="font-bold text-white text-[15px] mb-2">{v.title}</h3>
                        <p className="text-[12.5px] leading-relaxed font-light" style={{ color: T.textSec }}>{v.desc}</p>
                      </div>
                    </motion.div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          5. BUILD TOGETHER CTA
         ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0e0826 0%, #0a0f24 50%, #06121e 100%)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
              whileHover={{ boxShadow: "0 0 100px rgba(124,58,237,0.12)" }}
              transition={{ duration: 0.5 }}
            >
              <Particles count={16} color="139,92,246" />

              {/* Central glow */}
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: 640, height: 400, background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)", borderRadius: "50%" }}
              />

              <div className="relative z-10 text-center py-24 px-8">
                <SectionLabel text="Open Source Is For Everyone" />
                <h2
                  className="font-black tracking-tight text-white mb-5 leading-tight"
                  style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
                >
                  Build the future<br />
                  <span className="grad-text-warm">together.</span>
                </h2>
                <p
                  className="font-light leading-[1.8] mb-10 max-w-xl mx-auto"
                  style={{ fontSize: 16, color: T.textSec }}
                >
                  From your first commit to shipping real products — ASOC is where India's
                  open source movement begins. Every contribution matters.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    className="glow-btn px-10 py-4 rounded-full font-bold text-[15px] text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #0891b2)" }}
                  >
                    Join the Movement →
                  </button>
                  <button
                    className="ghost-btn px-10 py-4 rounded-full font-bold text-[15px]"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: T.textSec, background: "transparent" }}
                  >
                    Browse Projects
                  </button>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}