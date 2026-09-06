import React from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import { motion } from "motion/react";
import { Trophy, Code2, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeaderboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#06091b] text-white overflow-x-hidden selection:bg-indigo-500/30 relative flex flex-col justify-between">
      {/* Background Mesh Glow Layers */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-25"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(91,63,214,0.25) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-10"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 75%)" }}
      />

      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center items-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-indigo-400">
              ASOC Rankings
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-display"
          >
            Select <span className="gradient-text font-extrabold">Leaderboard</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/45 text-sm font-light leading-relaxed"
          >
            Monitor live progress, referrals, and code contributions of our participants. Select a leaderboard track below.
          </motion.p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          
          {/* Contributor Leaderboard (ACTIVE & UNLOCKED) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/contributor-leaderboard")}
            className="relative rounded-3xl overflow-hidden border border-emerald-500/10 hover:border-emerald-500/30 bg-[#0c102b]/20 hover:bg-[#0c102b]/40 p-8 backdrop-blur-md flex flex-col justify-between group shadow-2xl min-h-[380px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)]"
          >
            {/* Glowing Accent Top Border */}
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent group-hover:via-emerald-400 transition-all" />

            {/* Decorative Glow */}
            <div
              className="absolute top-0 right-0 w-44 h-44 pointer-events-none rounded-tr-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
              style={{ background: "radial-gradient(circle at 85% 15%, rgba(16,185,129,0.15) 0%, transparent 70%)" }}
            />

            <div>
              {/* Top Row: Icon & Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <Code2 size={24} className="animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full text-[9px] font-extrabold font-mono uppercase tracking-wider border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  ACTIVE
                </span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors">
                Contributor Leaderboard
              </h2>
              <p className="text-white/45 text-xs sm:text-sm font-light leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                Rankings based on merged pull requests, solved issues, points earned per task complexity, and code contributions to ASOC cohort repositories.
              </p>
            </div>

            {/* Bottom State */}
            <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between text-xs text-emerald-400/80 group-hover:text-emerald-300 transition-colors font-mono font-bold">
              <span>View Standings</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Ambassador Leaderboard (ACTIVE) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/ambassador-leaderboard")}
            className="relative rounded-3xl overflow-hidden border border-indigo-500/10 hover:border-indigo-500/30 bg-[#0c102b]/20 hover:bg-[#0c102b]/40 p-8 backdrop-blur-md flex flex-col justify-between group shadow-2xl min-h-[380px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)]"
          >
            {/* Glowing Accent Top Border */}
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-400 transition-all" />
            
            {/* Decorative Glow */}
            <div
              className="absolute top-0 right-0 w-44 h-44 pointer-events-none rounded-tr-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
              style={{ background: "radial-gradient(circle at 85% 15%, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
            />

            <div>
              {/* Top Row: Icon & Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <Trophy size={24} className="animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full text-[9px] font-extrabold font-mono uppercase tracking-wider border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  ACTIVE
                </span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                Ambassador Leaderboard
              </h2>
              <p className="text-white/45 text-xs sm:text-sm font-light leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                Standings based on campus outreach, referrals, verified signups, and cohort participant recruitment metrics.
              </p>
            </div>

            {/* Bottom State */}
            <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between text-xs text-indigo-400/80 group-hover:text-indigo-300 transition-colors font-mono font-bold">
              <span>View Standings</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
