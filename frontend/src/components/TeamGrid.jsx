import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import team1 from "../assets/team/team1.png";
import team2 from "../assets/team/team2.png";
import team3 from "../assets/team/team3.png";
import team4 from "../assets/team/team4.png";
import team5 from "../assets/team/team5.png";
import team6 from "../assets/team/team6.png";
import team7 from "../assets/team/team7.png";
import team8 from "../assets/team/team8.png";

gsap.registerPlugin(ScrollTrigger);

/* ─── Social icon SVGs ────────────────────────────────────────────────── */
const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.1.83-.26.83-.57l-.02-2.24c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07C3.68 21.62 2.15 20.08 2 16.85 1.94 15.58 1.93 15.2 1.93 12c0-3.2.01-3.58.07-4.85C2.15 3.92 3.68 2.38 6.15 2.23 7.42 2.17 7.8 2.16 12 2.16zm0-2.16c-3.26 0-3.67.01-4.95.07C2.7.22.22 2.7.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.15 4.36 2.62 6.83 6.98 6.98C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.01 4.95-.07 4.36-.15 6.83-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.15-4.35-2.62-6.83-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  ),
};

/* ─── Team grid data ──────────────────────────────────────────────────── */
const TEAM_MEMBERS = [
  {
    img: team1, name: "Aryan Sharma", role: "Founder",
    desc: "Visionary architect of India's largest open source movement. One commit, one community at a time.",
    socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" },
    from: "#7c3aed", to: "#4f46e5",
  },
  {
    img: team2, name: "Priya Mehta", role: "Co-Founder",
    desc: "Engineering leader who turned ASOC's technical vision into a platform thousands rely on.",
    socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" },
    from: "#0891b2", to: "#2563eb",
  },
  {
    img: team3, name: "Sneha Patel", role: "Tech Lead",
    desc: "Architect of ASOC's core infrastructure and open source toolchain powering contributor success.",
    socials: { github: "#", linkedin: "#", twitter: "#" },
    from: "#d97706", to: "#dc2626",
  },
  {
    img: team4, name: "Rohan Das", role: "Community Manager",
    desc: "The human engine keeping 50K+ contributors engaged, happy, and shipping code together.",
    socials: { github: "#", linkedin: "#", instagram: "#" },
    from: "#059669", to: "#0d9488",
  },
  {
    img: team5, name: "Vikram Nair", role: "Design Lead",
    desc: "Crafting pixel-perfect UX and motion systems across every surface of the ASOC platform.",
    socials: { linkedin: "#", instagram: "#" },
    from: "#db2777", to: "#9333ea",
  },
  {
    img: team6, name: "Aditya Kumar", role: "Backend Engineer",
    desc: "Scales ASOC's APIs and services to handle millions of monthly contributor requests.",
    socials: { github: "#", linkedin: "#" },
    from: "#6366f1", to: "#8b5cf6",
  },
  {
    img: team7, name: "Meera Singh", role: "Frontend Dev",
    desc: "Ships the beautiful, performant interfaces that contributors and maintainers love daily.",
    socials: { github: "#", linkedin: "#" },
    from: "#7c3aed", to: "#4f46e5",
  },
  {
    img: team8, name: "Karan Joshi", role: "DevOps Engineer",
    desc: "Zero-downtime deployments and bulletproof CI/CD across ASOC's global infrastructure.",
    socials: { github: "#", linkedin: "#" },
    from: "#2563eb", to: "#0891b2",
  },
];

/* ─── Single team card ────────────────────────────────────────────────── */
function TeamGridCard({ member, index }) {
  const cardRef = useRef(null);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={cardRef}
      className="team-grid-card relative rounded-2xl overflow-hidden h-full flex flex-col cursor-default group"
      style={{
        background: "#111827",
        border: `1px solid rgba(255,255,255,0.06)`,
        transition: "border-color 0.35s, box-shadow 0.35s, transform 0.35s",
        ...(hov && {
          borderColor: `${member.from}50`,
          boxShadow: `0 0 0 1px ${member.from}35, 0 25px 70px rgba(0,0,0,0.5), 0 0 60px ${member.from}15`,
          transform: "translateY(-8px)",
        }),
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Top gradient accent line */}
      <div className="relative h-[3px] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${member.from}, ${member.to})` }} />
        <div
          className="absolute inset-y-0 w-1/3"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
            transition: "transform 0.7s ease-in-out",
            transform: hov ? "translateX(350%)" : "translateX(-100%)",
          }}
        />
      </div>

      {/* Profile image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover"
          style={{
            transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
            transform: hov ? "scale(1.08)" : "scale(1)",
          }}
          loading="lazy"
        />
        {/* Bottom gradient fade into card body */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to top, #111827 0%, transparent 100%)",
          }}
        />

        {/* Glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${member.from}20 0%, transparent 65%)`,
            opacity: hov ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-2 gap-2">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-white leading-tight">{member.name}</h3>
        <span
          className="text-[11px] sm:text-[12px] font-semibold"
          style={{ color: member.from }}
        >
          {member.role}
        </span>
        <p
          className="text-[12px] leading-relaxed flex-1 font-light"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {member.desc}
        </p>

        {/* Social icons */}
        <div className="flex gap-2 mt-2">
          {Object.entries(member.socials).map(([type, href]) => (
            <a
              key={type}
              href={href}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = `${member.from}22`;
                e.currentTarget.style.borderColor = `${member.from}60`;
                e.currentTarget.style.boxShadow = `0 0 16px ${member.from}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {ICONS[type]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Team Grid ──────────────────────────────────────────────────── */
export default function TeamGrid() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".team-grid-card");

      /* Staggered fade-up + scale-in */
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* Title reveal */
      gsap.fromTo(
        section.querySelector(".grid-title"),
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        section.querySelector(".grid-sub"),
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, delay: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0B0F19",
        padding: "clamp(64px, 10vh, 120px) 0",
      }}
    >
      {/* Ambient background glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-8%", right: "-5%",
            width: 450, height: 450, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-10%", left: "-4%",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="grid-title font-black tracking-tight text-white mb-4"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Team
          </h2>
          <p
            className="grid-sub font-light leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(255,255,255,0.42)" }}
          >
            A diverse group of passionate professionals, each bringing unique skills
            and experiences to drive innovation and excellence in every project we
            undertake.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamGridCard key={i} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}