import React, { useState, useEffect, useRef } from "react";
import Navbar from "../component/layout/Navbar";
import { motion } from "motion/react";
import Footer from "./footer";

import team1 from "../assets/team/team1.png";
import team2 from "../assets/team/team2.png";
import team3 from "../assets/team/team3.png";
import team4 from "../assets/team/team4.png";
import team5 from "../assets/team/team5.png";
import team6 from "../assets/team/team6.png";
import team7 from "../assets/team/team7.png";
import team8 from "../assets/team/team8.png";

const stats = [
  { value: "50K+", label: "Contributors" },
  { value: "500K+", label: "Pull Requests" },
  { value: "1K+", label: "Projects" },
  { value: "5M+", label: "Lines of Code" },
];

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Real Impact",
    desc: "Work on meaningful open source projects used by thousands of developers worldwide.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Learn & Grow",
    desc: "Enhance your skills, collaborate with mentors, and grow together in a supportive environment.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Strong Community",
    desc: "Join a supportive community of contributors and maintainers from across India and beyond.",
  },
];

const SOCIAL_ICONS = {
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

const teamMembers = [
  {
    name: "Aryan Sharma", role: "Founder", img: team1,
    desc: "Visionary architect of India's largest open source movement. One commit, one community at a time.",
    socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    name: "Priya Mehta", role: "Co-Founder", img: team2,
    desc: "Engineering leader who turned ASOC's technical vision into a platform thousands rely on.",
    socials: { github: "#", linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    name: "Sneha Patel", role: "Tech Lead", img: team3,
    desc: "Architect of ASOC's core infrastructure and open source toolchain powering contributor success.",
    socials: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Rohan Das", role: "Community Manager", img: team4,
    desc: "The human engine keeping 50K+ contributors engaged, happy, and shipping code together.",
    socials: { github: "#", linkedin: "#", instagram: "#" }
  },
  {
    name: "Vikram Nair", role: "Design Lead", img: team5,
    desc: "Crafting pixel-perfect UX and motion systems across every surface of the ASOC platform.",
    socials: { linkedin: "#", instagram: "#" }
  },
  {
    name: "Aditya Kumar", role: "Backend Engineer", img: team6,
    desc: "Scales ASOC's APIs and services to handle millions of monthly contributor requests.",
    socials: { github: "#", linkedin: "#" }
  },
  {
    name: "Meera Singh", role: "Frontend Dev", img: team7,
    desc: "Ships the beautiful, performant interfaces that contributors and maintainers love daily.",
    socials: { github: "#", linkedin: "#" }
  },
  {
    name: "Karan Joshi", role: "DevOps Engineer", img: team8,
    desc: "Zero-downtime deployments and bulletproof CI/CD across ASOC's global infrastructure.",
    socials: { github: "#", linkedin: "#" }
  }
];

const getConfig = (width) => {
  if (width < 640) {
    return {
      R: 350,
      Y_offset: 280,
      cardWidth: 100,
      cardHeight: 140,
      angleStep: 22,
      containerHeight: 280,
    };
  } else if (width < 768) {
    return {
      R: 500,
      Y_offset: 400,
      cardWidth: 130,
      cardHeight: 180,
      angleStep: 20,
      containerHeight: 380,
    };
  } else if (width < 1024) {
    return {
      R: 650,
      Y_offset: 520,
      cardWidth: 155,
      cardHeight: 210,
      angleStep: 18,
      containerHeight: 480,
    };
  } else {
    return {
      R: 800,
      Y_offset: 640,
      cardWidth: 180,
      cardHeight: 245,
      angleStep: 16,
      containerHeight: 580,
    };
  }
};

export default function AboutPage() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const cardRefs = useRef([]);
  const angleOffset = useRef(0);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tick = (ts) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = ts;

      if (!pausedRef.current) {
        // Rotate right to left (angle decreases)
        angleOffset.current -= 8 * dt; // 8 degrees per second
      }

      const { R, Y_offset, angleStep } = getConfig(windowWidth);
      const totalSpan = teamMembers.length * angleStep;
      const halfSpan = totalSpan / 2;

      teamMembers.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        // Base angle centered around 0
        const baseAngle = (i - (teamMembers.length - 1) / 2) * angleStep;
        let angle = baseAngle + angleOffset.current;

        // Wrap angle to [-halfSpan, halfSpan]
        angle = ((angle + halfSpan) % totalSpan + totalSpan) % totalSpan - halfSpan;

        // Math for circle path
        const rad = (angle * Math.PI) / 180;
        const x = R * Math.sin(rad);
        const y = Y_offset - R * Math.cos(rad);

        // Opacity fade at the edges (fades out between 40 and 55 degrees)
        const absAngle = Math.abs(angle);
        let opacity = 1;
        if (absAngle > 40) {
          opacity = Math.max(0, 1 - (absAngle - 40) / 15);
        }

        // Hide cards that are completely faded out
        if (opacity <= 0.01) {
          el.style.visibility = "hidden";
        } else {
          el.style.visibility = "visible";
          const zIndex = Math.round(100 - absAngle);

          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) rotate(${angle.toFixed(2)}deg)`;
          el.style.opacity = opacity.toFixed(3);
          el.style.zIndex = zIndex;
        }
      });

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [windowWidth]);

  const config = getConfig(windowWidth);

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden" style={{ minHeight: 480 }}>
        <div className="absolute inset-0 starfield pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(91,63,214,0.25) 0%, transparent 65%)" }} />
        <div className="hidden sm:block absolute moon-crescent rounded-full mt-5 "
          style={{ top: 88, right: 80, width: 58, height: 58 }} />
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-violet-400 to-transparent" />
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
                About ASOC
              </span>
            </div>
            <h1 className="text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
              India's Largest<br />
              <span className="gradient-text">Open Source Program</span>
            </h1>
            <p className="text-[16px] leading-[1.8] text-white/50 max-w-[520px] font-light">
              ASOC connects developers with real-world open source projects — helping them learn,
              build, and make a lasting impact in the global developer community.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Team */}
      <section className="relative overflow-hidden bg-[#06091b]">
        {/* Glow backdrop */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-35 blur-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(91,63,214,0.4) 0%, transparent 70%)"
          }}
        />

        {/* <div className="relative z-10 max-w-7xl mx-auto px-6"> */}
        {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-4 tracking-tight">
              Meet our Team
            </h2>
            <p className="text-white/60 text-[clamp(14px,1.5vw,16px)] max-w-2xl mx-auto font-light leading-relaxed">
              A diverse team of passionate professionals with unique skills driving innovation and excellence in every project.
            </p>
          </motion.div> */}

        {/* Curved team list */}
        {/* <div
            className="relative w-full overflow-visible select-none flex justify-center pt-8 mt-30 sm:mt-60"
            style={{ height: config.containerHeight }}
          >
            {teamMembers.map((member, i) => {
              return (
                <div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "0",
                    width: config.cardWidth,
                    height: config.cardHeight,
                    visibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                  onMouseEnter={() => { pausedRef.current = true; }}
                  onMouseLeave={() => {
                    pausedRef.current = false;
                    lastTimeRef.current = null;
                  }}
                  className="relative group rounded-[24px] overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(91,63,214,0.35)] cursor-pointer"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover pointer-events-none"
                  /> */}
        {/* Subtle glass overlay with name and role on hover */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-center">
                    <p className="text-white font-bold text-xs sm:text-sm tracking-tight leading-tight">{member.name}</p>
                    <p className="text-violet-400 text-[10px] sm:text-xs mt-0.5 font-medium">{member.role}</p>
                  </div>
                </div> */}
        {/* );
            })}
          </div> */}
        {/* </div> */}
      </section>

      {/* Team Grid Section */}
      {/* <section className="relative  overflow-hidden bg-[#06091b] -mt-40 py-10 px-8"> */}
      {/* Glow backdrop */}
      {/* <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-20 blur-[130px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(91,63,214,0.3) 0%, transparent 70%)"
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto"> */}
      {/* Section header */}
      {/* <div className="text-center mb-16">
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-4 tracking-tight">
              Team
            </h2>
            <p className="text-white/40 text-[clamp(14px,1.5vw,16px)] max-w-2xl mx-auto font-light leading-relaxed">
              A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake.
            </p>
          </div> */}

      {/* Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex flex-col text-left"> */}
      {/* Photo */}
      {/* <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div> */}

      {/* Name */}
      {/* <h3 className="text-white font-bold text-[18px] mt-4 tracking-tight">
                  {member.name}
                </h3> */}

      {/* Role */}
      {/* <span className="text-[#5684FC] font-semibold text-[13px] mt-1 tracking-wide">
                  {member.role}
                </span> */}

      {/* Bio / Description */}
      {/* <p className="text-white/50 text-[13px] mt-2.5 leading-relaxed font-light flex-1">
                  {member.desc}
                </p> */}

      {/* Social links */}
      {/* <div className="flex items-center gap-3 mt-4 text-white/30">
                  {Object.entries(member.socials).map(([type, href]) => (
                    <a
                      key={type}
                      href={href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {SOCIAL_ICONS[type]}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ASOC */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(24px,3vw,40px)] font-bold text-white mb-4">
            Why <span className="gradient-text">ASOC?</span>
          </h2>
          <p className="text-white/40 text-[15px] max-w-lg mx-auto font-light leading-relaxed">
            A platform that empowers developers to contribute, collaborate,
            and grow in the open source ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="card-glass rounded-2xl p-8 border border-white/[0.06] shimmer-border"
            >
              <div className="w-12 h-12 rounded-xl btn-violet flex items-center justify-center mb-5 text-white">
                {v.icon}
              </div>
              <h3 className="text-[18px] font-bold text-white mb-3">{v.title}</h3>
              <p className="text-white/40 text-[14px] leading-relaxed font-light">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Build together banner */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.08] p-12 md:p-20"
            style={{ background: "linear-gradient(135deg, rgba(108,63,214,0.18) 0%, rgba(6,9,27,0.9) 60%)" }}
          >
            <div className="absolute inset-0 starfield opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
                Open Source Is For Everyone
              </span>
              <h3 className="text-[clamp(28px,4vw,48px)] font-bold text-white mt-4 mb-6 leading-tight">
                Build the future together.
              </h3>
              <p className="text-white/40 text-[15px] leading-relaxed font-light mb-8 max-w-md">
                From beginners to advanced developers, everyone has a place in open source.
                Find projects, fix bugs, add features, and make a difference.
              </p>
              <button className="font-bold text-[14px] px-8 py-3.5 rounded-full text-white btn-violet
                                 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
                Start Contributing →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="py-16 px-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-[36px] font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-white/40 text-[13px] font-light">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section> */}



      {/* Footer */}
      <Footer />
    </div>
  );
}