import React, { useState, useEffect } from "react";
import { Trophy, Award, Sparkles, BookOpen, Copy, Check, ArrowRight, Star } from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const localColorMap = {
  teal: {
    pill: "bg-emerald-500/20 text-emerald-300",
    icon: "bg-emerald-500/15",
    border: "border-emerald-500/25",
    glow: "rgba(34,211,168,0.18)",
    text: "text-emerald-300",
    pts: "bg-emerald-500/15 text-emerald-300",
    starColor: "#22c55e"
  },
  rose: {
    pill: "bg-red-500/20 text-red-300",
    icon: "bg-red-500/15",
    border: "border-red-500/25",
    glow: "rgba(248,113,113,0.18)",
    text: "text-red-300",
    pts: "bg-red-500/15 text-red-300",
    starColor: "#ef4444"
  }
};

export default function AmbassadorLeaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && (user.role === "admin" || (user.roles && user.roles.includes("admin")));
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Fake preview data for UI testing (remove once real data flows in)
  const FAKE_DATA = [
    { id: "fake1", name: "Ayaan Sheikh", referralCode: "AY7X3", points: 320, commits: 6, rank: 1, avatar: "" },
    { id: "fake2", name: "Tuba Naaz", referralCode: "TB9K1", points: 260, commits: 5, rank: 2, avatar: "" },
    { id: "fake3", name: "Jai Jadhav", referralCode: "JJ28X", points: 210, commits: 4, rank: 3, avatar: "" },
    { id: "fake4", name: "Riya Sharma", referralCode: "RY4M2", points: 180, commits: 3, rank: 4, avatar: "" },
    { id: "fake5", name: "Arjun Patel", referralCode: "AR5N7", points: 150, commits: 3, rank: 5, avatar: "" },
    { id: "fake6", name: "Sneha Gupta", referralCode: "SN8P4", points: 120, commits: 2, rank: 6, avatar: "" },
    { id: "fake7", name: "Kunal Verma", referralCode: "KN2Q9", points: 100, commits: 2, rank: 7, avatar: "" },
    { id: "fake8", name: "Priya Iyer", referralCode: "PR6W1", points: 80, commits: 1, rank: 8, avatar: "" },
    { id: "fake9", name: "Rohan Das", referralCode: "RH8D3", points: 70, commits: 1, rank: 9, avatar: "" },
    { id: "fake10", name: "Neha Sen", referralCode: "NH5S2", points: 60, commits: 1, rank: 10, avatar: "" },
    { id: "fake11", name: "Amit Raj", referralCode: "AM3R1", points: 50, commits: 0, rank: 11, avatar: "" },
  ];

  const fetchLeaderboardData = async (currentSkip, isInitial = false) => {
    const currentLimit = isInitial ? 7 : 4;
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await API.get(`/api/leaderboard/ambassador?skip=${currentSkip}&limit=${currentLimit}`);
      if (res.data && res.data.success && res.data.leaderboard && res.data.leaderboard.length > 0) {
        if (isInitial) {
          setLeaderboard(res.data.leaderboard);
        } else {
          setLeaderboard((prev) => [...prev, ...res.data.leaderboard]);
        }
        setHasMore(res.data.hasMore);
      }
      // else {
      //   simulateFakePagination(currentSkip, currentLimit, isInitial);
      // }
    } catch (error) {
      console.error("Failed to fetch ambassador leaderboard data:", error);
      // simulateFakePagination(currentSkip, currentLimit, isInitial);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const simulateFakePagination = (currentSkip, currentLimit, isInitial) => {
    const sliced = FAKE_DATA.slice(currentSkip, currentSkip + currentLimit);
    if (isInitial) {
      setLeaderboard(sliced);
    } else {
      setLeaderboard((prev) => [...prev, ...sliced]);
    }
    setHasMore(currentSkip + currentLimit < FAKE_DATA.length);
  };

  useEffect(() => {
    fetchLeaderboardData(0, true);
  }, []);

  const handleLoadMore = () => {
    const nextSkip = leaderboard.length;
    fetchLeaderboardData(nextSkip, false);
  };

  const handleCopyCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find current user's rank in leaderboard
  const userRank = leaderboard.findIndex(
    (item) => item.id === user?._id
  ) + 1;

  // Split top 3 and others
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const maxPoints = leaderboard[0]?.points || 100;
  const topFive = leaderboard.slice(0, 5);

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="font-sans relative">
      <Navbar />

      {/* Cosmic glow background glows */}
      <div className="absolute top-20 left-1/4 w-[40vw] h-[40vw] rounded-full bg-teal-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[35vw] h-[35vw] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-gradient-to-r from-violet-500 to-transparent" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-violet-300"
                style={{ color: "#a78bfa" }}>
                Ambassador Standings & Referral Stats
              </span>
              <div className="h-px w-6 bg-gradient-to-l from-violet-500 to-transparent" />
            </div>
            <h1 className="font-body text-3xl sm:text-[38px] font-bold text-white mb-3 tracking-tight">
              Ambassador <span className="gradient-text font-extrabold">Leaderboard</span>
            </h1>
            <p className="font-body text-[15px] text-white/40 max-w-xl mx-auto font-light leading-relaxed">
              Invite developers to the platform, build your local campus community, and scale our program together.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Syncing rankings database...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="block sm:flex gap-6 w-full">
            <div className="w-full py-24 text-center border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-md">
              <Trophy className="mx-auto text-slate-600 mb-4 opacity-40 animate-pulse" size={48} />
              <h3 className="text-xl font-bold text-slate-300">Leaderboard is Empty</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto font-light leading-relaxed">
                No Ambassadors have earned referral points yet. Share your referral code with developers to enter the rankings!
              </p>
            </div>
            {/* 2. Rule Book Card */}
            <div className="relative rounded-xl p-5 border border-violet-500/30 border-opacity-30 card-glass shadow-lg text-left mt-5 sm:mt-0">
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-tr-xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 90% 10%, rgba(139,92,246,0.22) 0%, transparent 70%)" }} />

              <div className="relative z-10">
                <h3 className="font-display text-[15px] font-bold text-white leading-[1.35] tracking-tight flex items-center gap-2 mb-4">
                  <BookOpen size={14} className="text-violet-400" /> Ambassador Rule Book
                </h3>

                <div className="space-y-4 text-[13px] font-light text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">1. Referral Points Scale</h4>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      {/* <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                        <span className="text-slate-400">User Verify / Signup</span>
                        <span className="text-emerald-400 font-bold">+50 pts</span>
                      </div> */}
                      <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                        <span className="text-slate-400">Contributor Approval</span>
                        <span className="text-emerald-400 font-bold">+30 pts</span>
                      </div>
                      <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                        <span className="text-slate-400">Ambassador Approval</span>
                        <span className="text-emerald-400 font-bold">+40 pts</span>
                      </div>
                      <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                        <span className="text-slate-400">Project Admin Approval</span>
                        <span className="text-emerald-400 font-bold">+50 pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">2. Code of Integrity</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[12px]">
                      <li>Self-referrals are strictly tracked and prohibited.</li>
                      <li>Spammed, fake, or duplicate signups will result in automatic points deduction.</li>
                      <li>Referral points are subject to validation checks before payouts.</li>
                    </ul>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">3. Milestone Rewards</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[12px]">
                      <li>Exclusive ASOC swag and perks upon reaching <strong className="text-white">1000 pts</strong>.</li>
                      <li>Special certificate of excellence for all active ambassadors.</li>
                      <li>Top 3 standouts featured globally across Altraverse networks.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column (8 cols): Podium & Rankings */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* ── Podium Section: Top 3 ── */}
              {/* <div className="relative rounded-2xl overflow-hidden shimmer-border spotlight-card p-6 sm:p-8 shadow-violet-lg"> */}
              {/* Ambient glows */}
              {/* <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 80% 15%, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none" */}
              {/* style={{ background: "radial-gradient(circle at 20% 85%, rgba(34,211,168,0.10) 0%, transparent 65%)" }} /> */}

              {/* Section Header */}
              <div className="flex items-center gap-2 mb-8 relative z-10">
                <div className="h-px w-6 bg-gradient-to-r from-violet-500 to-transparent" />
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#a78bfa" }}>
                  Top Ambassadors
                </span>
              </div>

              {/* Podium Grid: 2nd | 1st | 3rd */}
              <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 pb-4">
                {/* 2nd Place */}
                {topThree[1] && (() => {
                  const amb = topThree[1];
                  const isSelf = amb.id === user?._id;
                  const initials = amb.name ? amb.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "A";
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      onClick={isAdmin ? () => navigate(`/admin/users/${amb.id}`) : undefined}
                      className={`flex flex-col items-center w-[30%] max-w-[160px] card-glass rounded-2xl border p-4 sm:p-5 pt-6 sm:pt-8 relative ${isSelf ? "border-teal-500/40 ring-1 ring-teal-500/20" : "border-white/[0.06]"
                        } ${isAdmin ? "cursor-pointer hover:-translate-y-0.5 hover:border-violet-500/30 transition-all duration-200" : ""}`}
                    >
                      {/* Star Badge */}
                      <div className="absolute -top-4 sm:-top-5 flex items-center justify-center select-none">
                        <div className="relative flex items-center justify-center">
                          <Star className="w-8 h-8 sm:w-9 sm:h-9" color="#ef4444" fill="#ef4444" />
                          <span className="absolute text-[10px] sm:text-xs font-extrabold text-white font-mono">2</span>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="relative mb-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-400/40 bg-[#131947] flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(148,163,184,0.15)]">
                          {amb.avatar && amb.avatar.startsWith("http") ? (
                            <img src={amb.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-300 font-mono">{amb.avatar || initials}</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-display text-[13px] sm:text-[15px] font-bold text-white truncate max-w-full text-center leading-tight">
                        {amb.name}
                      </h4>
                      {amb.referralCode && (
                        <span className="font-mono text-[10px] text-white/25 mt-0.5">CODE: {amb.referralCode}</span>
                      )}
                      <span className="font-display text-base sm:text-lg font-extrabold mt-2" style={{ color: "#94a3b8" }}>
                        {amb.points} pts
                      </span>
                      <span className="font-mono text-[10px] text-white/30 mt-0.5">{amb.commits} referrals</span>
                    </motion.div>
                  );
                })()}

                {/* 1st Place (Center, Elevated) */}
                {topThree[0] && (() => {
                  const amb = topThree[0];
                  const isSelf = amb.id === user?._id;
                  const initials = amb.name ? amb.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "A";
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      onClick={isAdmin ? () => navigate(`/admin/users/${amb.id}`) : undefined}
                      className={`flex flex-col items-center w-[34%] max-w-[180px] card-glass rounded-2xl border p-4 sm:p-6 pt-6 sm:pt-8 -mt-6 sm:-mt-10 relative ${isSelf ? "border-teal-500/40 ring-1 ring-teal-500/20" : "border-violet-500/20"
                        } ${isAdmin ? "cursor-pointer hover:-translate-y-1.5 hover:border-violet-500/40 transition-all duration-200" : ""}`}
                    >
                      {/* Star Badge */}
                      <div className="absolute -top-5 sm:-top-6 flex items-center justify-center select-none">
                        <div className="relative flex items-center justify-center">
                          <Star className="w-9 h-9 sm:w-11 sm:h-11" color="gold" fill="gold" />
                          <span className="absolute text-xs sm:text-sm font-extrabold text-black font-mono">1</span>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="relative mb-3 mt-2">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-violet-500/50 bg-[#131947] flex items-center justify-center font-bold text-lg text-white overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.25)]">
                          {amb.avatar && amb.avatar.startsWith("http") ? (
                            <img src={amb.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-violet-300 font-mono">{amb.avatar || initials}</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-display text-[14px] sm:text-[17px] font-bold text-white truncate max-w-full text-center leading-tight">
                        {amb.name}
                      </h4>
                      {amb.referralCode && (
                        <span className="font-mono text-[10px] text-white/25 mt-0.5">CODE: {amb.referralCode}</span>
                      )}
                      <span className="font-display text-lg sm:text-2xl font-extrabold mt-2 gradient-text">
                        {amb.points} pts
                      </span>
                      <span className="font-mono text-[10px] text-white/30 mt-0.5">{amb.commits} referrals</span>
                    </motion.div>
                  );
                })()}

                {/* 3rd Place */}
                {topThree[2] && (() => {
                  const amb = topThree[2];
                  const isSelf = amb.id === user?._id;
                  const initials = amb.name ? amb.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "A";
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      onClick={isAdmin ? () => navigate(`/admin/users/${amb.id}`) : undefined}
                      className={`flex flex-col items-center w-[30%] max-w-[160px] card-glass rounded-2xl border p-4 sm:p-5 pt-6 sm:pt-8 relative ${isSelf ? "border-teal-500/40 ring-1 ring-teal-500/20" : "border-white/[0.06]"
                        } ${isAdmin ? "cursor-pointer hover:-translate-y-0.5 hover:border-violet-500/30 transition-all duration-200" : ""}`}
                    >
                      {/* Star Badge */}
                      <div className="absolute -top-4 sm:-top-5 flex items-center justify-center select-none">
                        <div className="relative flex items-center justify-center">
                          <Star className="w-8 h-8 sm:w-9 sm:h-9" color="#22c55e" fill="#22c55e" />
                          <span className="absolute text-[10px] sm:text-xs font-extrabold text-white font-mono">3</span>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="relative mb-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-600/40 bg-[#131947] flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(217,119,6,0.15)]">
                          {amb.avatar && amb.avatar.startsWith("http") ? (
                            <img src={amb.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-amber-300 font-mono">{amb.avatar || initials}</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-display text-[13px] sm:text-[15px] font-bold text-white truncate max-w-full text-center leading-tight">
                        {amb.name}
                      </h4>
                      {amb.referralCode && (
                        <span className="font-mono text-[10px] text-white/25 mt-0.5">CODE: {amb.referralCode}</span>
                      )}
                      <span className="font-display text-base sm:text-lg font-extrabold mt-2 text-amber-400">
                        {amb.points} pts
                      </span>
                      <span className="font-mono text-[10px] text-white/30 mt-0.5">{amb.commits} referrals</span>
                    </motion.div>
                  );
                })()}
              </div>
              {/* </div> */}

              {/* ── Remaining Rankings List ── */}
              {remaining.length > 0 && (
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-6 bg-gradient-to-r from-violet-500 to-transparent" />
                    <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#a78bfa" }}>
                      Remaining Standings
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {remaining.map((leader, idx) => {
                      const isSelf = leader.id === user?._id;
                      const initials = leader.name
                        ? leader.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                        : "A";

                      const colorKey = idx % 2 === 0 ? "teal" : "rose";
                      const cm = localColorMap[colorKey];
                      const borderClass = isSelf
                        ? "border-teal-400"
                        : `${cm.border} border-opacity-30 hover:border-opacity-60`;

                      return (
                        <motion.div
                          key={leader.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.05 * idx }}
                          onClick={isAdmin ? () => navigate(`/admin/users/${leader.id}`) : undefined}
                          className={`relative rounded-xl p-4 border transition-all duration-250 cursor-pointer card-glass flex items-start gap-3 group hover:-translate-y-0.5 hover:shadow-card ${borderClass}`}
                        >
                          {/* Corner accent glow */}
                          <div
                            className="absolute top-0 right-0 w-[60px] h-[60px] rounded-tr-xl pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 90% 10%, ${cm.glow} 0%, transparent 70%)`
                            }}
                          />

                          <div className="flex items-start gap-3 w-full relative z-10">
                            {/* Star Badge */}
                            {/* <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cm.icon}`}> */}
                            <div className="relative flex items-center justify-center">
                              <Star className="w-8 h-8" color={cm.starColor} fill={cm.starColor} />
                              <span className="absolute text-[8px] sm:text-[15px] font-extrabold text-white font-mono">
                                {leader.rank}
                              </span>
                            </div>
                            {/* </div> */}

                            {/* Body */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2  flex-wrap">
                                {/* <span className={`font-body text-[10px] font-bold tracking-[0.13em] uppercase px-2.5 py-0.5 rounded-full ${cm.pill}`}>
                                  Ambassador
                                </span> */}
                                <h3 className="font-display text-[14px] font-bold text-white leading-[1.35] mb-1.5 tracking-tight">
                                  {leader.name}
                                </h3>
                                {leader.referralCode && (
                                  <span className="font-mono text-[10px] text-white/30">
                                    CODE: {leader.referralCode}
                                  </span>
                                )}
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 bg-teal-500/20 border border-teal-500/30 text-[9px] uppercase tracking-wider font-mono text-teal-400 font-extrabold rounded flex-shrink-0">
                                    You
                                  </span>
                                )}
                              </div>



                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[11px] text-white/25 tracking-wide">
                                  {leader.commits || 0} referrals
                                </span>
                                <span className={`font-display text-[12px] font-bold px-2.5 py-0.5 rounded-lg ${cm.pts}`}>
                                  +{leader.points} pts
                                </span>
                              </div>
                            </div>


                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-5 py-2.5 rounded-xl border border-violet-500/30 card-glass text-xs sm:text-sm font-bold text-violet-300 hover:text-white hover:border-violet-500/60 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <>
                            <div className="h-4 w-4 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
                            Loading Standings...
                          </>
                        ) : (
                          <>
                            Load More Standings
                            <ArrowRight size={14} className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column (4 cols): User Standings & Rule Book */}
            <div className="lg:col-span-4 flex flex-col gap-6 w-full">

              {/* 1. Logged-in User Standing Card */}
              {user && (user.role === "ambassador" || (user.roles && user.roles.includes("ambassador"))) && (
                <div className="relative rounded-xl p-5 border border-teal-500/30 card-glass flex flex-col justify-between text-left">
                  {/* Corner accent glow */}
                  <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-tr-xl pointer-events-none"
                    style={{ background: "radial-gradient(circle at 90% 10%, rgba(20,184,166,0.18) 0%, transparent 70%)" }} />

                  <div className="relative z-10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-mono uppercase tracking-widest text-teal-400 font-bold mb-3 flex items-center gap-1.5">
                        Your Standings <Sparkles size={13} className="text-yellow-500 animate-pulse" />
                      </h3>

                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-11 h-11 rounded-full bg-[#131947] border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 font-mono text-base shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                          {userRank > 0 ? `#${userRank}` : "UR"}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-white truncate max-w-[150px]">{user.name}</div>
                          {user.referralCode && (
                            <div className="text-[12px] text-teal-300 font-mono font-bold mt-0.5 flex items-center gap-1.5">
                              <span>Code: {user.referralCode}</span>
                              <button
                                onClick={handleCopyCode}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/5 flex items-center justify-center"
                                title="Copy referral code"
                              >
                                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm font-mono border-t border-white/5 pt-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">Invites</span>
                        <span className="font-bold text-white text-base">{user.referralsCount || 0} users</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">Score</span>
                        <span className="font-extrabold text-teal-400 text-base">{user.points || 0} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Rule Book Card */}
              <div className="relative rounded-xl p-5 border border-violet-500/30 border-opacity-30 card-glass shadow-lg text-left">
                {/* Corner accent glow */}
                <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-tr-xl pointer-events-none"
                  style={{ background: "radial-gradient(circle at 90% 10%, rgba(139,92,246,0.22) 0%, transparent 70%)" }} />

                <div className="relative z-10">
                  <h3 className="font-display text-[15px] font-bold text-white leading-[1.35] tracking-tight flex items-center gap-2 mb-4">
                    <BookOpen size={14} className="text-violet-400" /> Ambassador Rule Book
                  </h3>

                  <div className="space-y-4 text-[13px] font-light text-slate-300 leading-relaxed">
                    <div>
                      <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">1. Referral Points Scale</h4>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {/* <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                          <span className="text-slate-400">User Verify / Signup</span>
                          <span className="text-emerald-400 font-bold">+50 pts</span>
                        </div> */}
                        <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                          <span className="text-slate-400">Contributor Approval</span>
                          <span className="text-emerald-400 font-bold">+30 pts</span>
                        </div>
                        <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                          <span className="text-slate-400">Ambassador Approval</span>
                          <span className="text-emerald-400 font-bold">+40 pts</span>
                        </div>
                        <div className="flex justify-between bg-white/[0.01] px-2 py-1 rounded">
                          <span className="text-slate-400">Project Admin Approval</span>
                          <span className="text-emerald-400 font-bold">+50 pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">2. Code of Integrity</h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[12px]">
                        <li>Self-referrals are strictly tracked and prohibited.</li>
                        <li>Spammed, fake, or duplicate signups will result in automatic points deduction.</li>
                        <li>Referral points are subject to validation checks before payouts.</li>
                      </ul>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <h4 className="font-bold text-white mb-1.5 uppercase font-mono tracking-wider text-[10px] text-slate-500">3. Milestone Rewards</h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[12px]">
                        <li>Exclusive ASOC swag and perks upon reaching <strong className="text-white">1000 pts</strong>.</li>
                        <li>Special certificate of excellence for all active ambassadors.</li>
                        <li>Top 3 standouts featured globally across Altraverse networks.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
