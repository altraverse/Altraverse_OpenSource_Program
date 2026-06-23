import React from "react";
import Navbar from "../component/layout/Navbar";
import { motion } from "motion/react";
import Footer from "./footer";

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

const team = [
  { name: "Aryan Sharma", role: "Program Lead", initial: "A" },
  { name: "Priya Mehta", role: "Core Maintainer", initial: "P" },
  { name: "Rohan Das", role: "Community Manager", initial: "R" },
  { name: "Sneha Patel", role: "Tech Lead", initial: "S" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden" style={{ minHeight: 480 }}>
        <div className="absolute inset-0 starfield pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(91,63,214,0.25) 0%, transparent 65%)" }} />
        <div className="absolute moon-crescent rounded-full"
          style={{ top: 80, right: 100, width: 52, height: 52 }} />
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
      <section className="py-16 px-8 border-t border-white/[0.06]">
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
      </section>

      {/* Team */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(24px,3vw,40px)] font-bold text-white mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-white/40 text-[15px] font-light">
            The people behind ASOC who make it all happen.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-glass rounded-2xl p-6 border border-white/[0.06] text-center"
            >
              <div className="w-14 h-14 rounded-full btn-violet flex items-center justify-center
                              text-[20px] font-bold text-white mx-auto mb-4">
                {t.initial}
              </div>
              <div className="text-[15px] font-semibold text-white mb-1">{t.name}</div>
              <div className="text-[12px] text-white/40 font-light">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
