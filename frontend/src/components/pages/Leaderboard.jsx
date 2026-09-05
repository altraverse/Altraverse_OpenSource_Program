import React, { useState, useEffect } from "react";
import { Trophy, Award, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/api/leaderboard");
        if (res.data && res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Find current user's rank in leaderboard
  const userRank = leaderboard.findIndex(
    (item) =>
      item.id === user?._id ||
      (user?.githubUsername && item.githubUsername?.toLowerCase() === user?.githubUsername?.toLowerCase())
  ) + 1;

  // Split top 3 and others
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Position mappings for podium: [2nd, 1st, 3rd]
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ ...topThree[1], pos: 2 }); // 2nd place
  if (topThree[0]) podiumOrder.push({ ...topThree[0], pos: 1 }); // 1st place
  if (topThree[2]) podiumOrder.push({ ...topThree[2], pos: 3 }); // 3rd place

  // In case there is only 1 or 2 contributors
  const getPodiumList = () => {
    if (topThree.length === 1) {
      return [{ ...topThree[0], pos: 1 }];
    }
    if (topThree.length === 2) {
      return [
        { ...topThree[1], pos: 2 },
        { ...topThree[0], pos: 1 }
      ];
    }
    return podiumOrder;
  };

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="font-sans relative">
      <Navbar />

      {/* Cosmic glow background glows */}
      <div className="absolute top-20 left-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-gradient-to-r from-violet-500 to-transparent" />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-violet-400">
              ASOC Rankings & Tiers
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-[38px] font-extrabold text-white mb-3 tracking-tight">
            Cohort <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Leaderboard</span>
          </h1>
          <p className="font-body text-[13px] text-white/40 max-w-md mx-auto font-light leading-relaxed">
            Resolve issues, build products, and earn developer points to climb the ranking order.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Syncing rankings database...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-24 text-center border border-white/5 bg-[#0c102b]/20 rounded-3xl backdrop-blur-md">
            <Trophy className="mx-auto text-slate-600 mb-4 opacity-40 animate-pulse" size={48} />
            <h3 className="text-lg font-bold text-slate-300">Leaderboard is Empty</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto font-light leading-relaxed">
              No contributors have resolved points-based issues yet. Connect your GitHub account and claim your first issue!
            </p>
            <div className="mt-6">
              <Link to="/projects" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/15">
                Find Open Projects
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Logged in User Standing card - Neighborhood View Spotlight */}
            {user && (
              <div className="max-w-4xl mx-auto mb-10 p-5 rounded-3xl bg-gradient-to-r from-violet-950/20 via-indigo-950/20 to-purple-950/20 border border-violet-500/20 backdrop-blur-md flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-4">
                  {/* Your Rank Ring */}
                  <div className={`rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 font-mono shadow-[0_0_10px_rgba(139,92,246,0.1)] ${
                    userRank > 0 ? "w-10 h-10 text-sm" : "px-3 py-1.5 text-[10px]"
                  }`}>
                    {userRank > 0 ? `#${userRank}` : "Unranked"}
                  </div>
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-violet-400 font-bold flex items-center gap-1">
                      Your Standing <Sparkles size={10} className="text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {user.name}{" "}
                      {user.githubUsername && (
                        <span className="text-[10px] text-slate-500 font-mono font-normal">
                          (@{user.githubUsername})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-right items-center">
                  <div className="pr-4 border-r border-white/5">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Solved</span>
                    <span className="font-bold text-white text-sm font-mono">{user.solvedIssuesCount || 0} issues</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Score</span>
                    <span className="font-extrabold text-indigo-400 text-sm font-mono">{user.points || 0} pts</span>
                  </div>
                </div>
              </div>
            )}

            {/* Podium for Top 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end justify-center mb-16 mt-8 max-w-4xl mx-auto">
              {getPodiumList().map((leader) => {
                const isFirst = leader.pos === 1;
                const isSecond = leader.pos === 2;
                const isThird = leader.pos === 3;
                const isSelf = leader.id === user?._id;

                const initials = leader.name
                  ? leader.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  : "C";

                return (
                  <div
                    key={leader.id}
                    className={`relative flex flex-col items-center p-6 rounded-3xl bg-[#0c102b]/40 border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                      isFirst
                        ? `border-yellow-500/30 shadow-[0_10px_30px_rgba(234,179,8,0.06)] py-8 order-1 sm:order-2 ${isSelf ? 'border-yellow-500 ring-1 ring-yellow-500/20' : ''}`
                        : isSecond
                        ? `border-slate-300/20 shadow-lg order-2 sm:order-1 ${isSelf ? 'border-indigo-500 ring-1 ring-indigo-500/20' : ''}`
                        : `border-amber-600/20 shadow-lg order-3 ${isSelf ? 'border-indigo-500 ring-1 ring-indigo-500/20' : ''}`
                    }`}
                  >
                    {/* Rank Badge Indicator */}
                    <div
                      className={`absolute -top-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                        isFirst
                          ? "bg-yellow-500 text-black border-yellow-400"
                          : isSecond
                          ? "bg-slate-400 text-black border-slate-300"
                          : "bg-amber-700 text-white border-amber-600"
                      }`}
                    >
                      {leader.pos}
                    </div>

                    {/* Avatar Icon */}
                    <div className="relative mb-4 mt-2">
                      <div
                        className={`absolute inset-0 rounded-full blur-md opacity-30 ${
                          isFirst ? "bg-yellow-500" : isSecond ? "bg-slate-400" : "bg-amber-600"
                        }`}
                      />
                      <div className="relative w-16 h-16 rounded-full bg-[#131947] border border-white/10 flex items-center justify-center text-xl font-bold font-mono text-white overflow-hidden shadow-lg">
                        {leader.avatar && leader.avatar.startsWith("http") ? (
                          <img src={leader.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          leader.avatar || initials
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-center w-full">
                      <h3 className="text-sm font-bold text-white truncate max-w-[150px] mx-auto flex items-center justify-center gap-1">
                        {leader.name}
                        {isSelf && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />}
                      </h3>
                      {leader.githubUsername && (
                        <a
                          href={`https://github.com/${leader.githubUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:underline mt-1 font-mono"
                        >
                          @{leader.githubUsername} <ExternalLink size={8} />
                        </a>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono uppercase mt-1">Contributor</div>

                      {/* Points Card */}
                      <div className="mt-5 pt-4 border-t border-white/[0.05] flex justify-between items-center text-xs">
                        <div className="text-left">
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Solved</span>
                          <span className="font-bold text-white font-mono">{leader.commits} issues</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Score</span>
                          <span className="font-extrabold text-indigo-400 font-mono">{leader.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of Ranks Table */}
            {remaining.length > 0 && (
              <div className="bg-[#0c102b]/20 border border-white/[0.04] rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-[#070b20]/50 text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                        <th className="py-4 px-6 text-center w-16">Rank</th>
                        <th className="py-4 px-6">Contributor</th>
                        <th className="py-4 px-6">GitHub</th>
                        <th className="py-4 px-6 text-center w-32">Issues Solved</th>
                        <th className="py-4 px-6 text-right w-36">Total Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {remaining.map((leader) => {
                        const isSelf = leader.id === user?._id;
                        const initials = leader.name
                          ? leader.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                          : "C";

                        return (
                          <tr
                            key={leader.id}
                            className={`text-xs hover:bg-white/[0.01] transition-colors ${
                              isSelf ? "bg-violet-900/10 border-l-[3px] border-l-violet-500" : ""
                            }`}
                          >
                            {/* Rank */}
                            <td className={`py-4 px-6 text-center font-mono font-bold ${
                              isSelf ? "text-violet-400" : "text-slate-400"
                            }`}>
                              {leader.rank}
                            </td>

                            {/* Contributor Profile */}
                            <td className="py-4 px-6 font-medium text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#131947] border border-white/5 flex items-center justify-center font-bold text-[10px] text-white overflow-hidden">
                                  {leader.avatar && leader.avatar.startsWith("http") ? (
                                    <img src={leader.avatar} alt="avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    leader.avatar || initials
                                  )}
                                </div>
                                <span className={`font-semibold ${isSelf ? "text-violet-300" : "text-slate-200"}`}>
                                  {leader.name}
                                </span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 bg-violet-500/20 border border-violet-500/30 text-[8px] uppercase tracking-wider font-mono text-violet-400 font-extrabold rounded">
                                    You
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* GitHub link */}
                            <td className="py-4 px-6 font-mono text-slate-400">
                              {leader.githubUsername ? (
                                <a
                                  href={`https://github.com/${leader.githubUsername}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 hover:text-indigo-400 transition"
                                >
                                  @{leader.githubUsername} <ExternalLink size={10} className="opacity-50" />
                                </a>
                              ) : (
                                <span className="text-slate-600 font-light">Not linked</span>
                              )}
                            </td>

                            {/* Issues solved */}
                            <td className="py-4 px-6 text-center font-mono text-slate-300 font-bold">
                              {leader.commits}
                            </td>

                            {/* Score */}
                            <td className="py-4 px-6 text-right font-mono font-extrabold text-indigo-400 text-sm">
                              {leader.points} pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
