import { useState } from "react";
import {
  MessageSquare,
  Users,
  Award,
  Trophy,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Compass,
  ShieldCheck,
  FileCode2
} from "lucide-react";


const Github = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={{ width: props.size || 24, height: props.size || 24 }}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

export default function Community() {
  const { user, setUser, logout } = useAuth();
  const [joining, setJoining] = useState(false);

  const handleJoinCommunity = async () => {
    try {
      setJoining(true);
      const res = await API.post("/api/auth/join-community");
      setUser(res.data.user);
    } catch (error) {
      console.error("Join community failed", error);
    } finally {
      setJoining(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06091b] text-white flex-col gap-4">
        <h2 className="text-xl font-bold">Please log in to view the community dashboard</h2>
        <Link to="/login" className="px-6 py-2 bg-indigo-600 rounded-full font-semibold">Log In</Link>
      </div>
    );
  }

  // Initials for avatar
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Mock Leaders
  const leaderboard = [
    { rank: 1, name: "Prachi Shah", points: 2850, commits: 45, role: "Ambassador", avatar: "P" },
    { rank: 2, name: "Rahul Deshmukh", points: 2420, commits: 38, role: "Contributor", avatar: "R" },
    { rank: 3, name: "Sneha Patil", points: 1980, commits: 29, role: "Contributor", avatar: "S" },
    { rank: 4, name: "Om Parkhi", points: 1540, commits: 22, role: "Admin", avatar: "O" },
    { rank: 5, name: "Aditya Kulkarni", points: 1210, commits: 17, role: "Contributor", avatar: "A" },
  ];

  // Mock Channels
  const channels = [
    { name: "#announcements", desc: "Official news and updates from project admins.", posts: 14, icon: Sparkles },
    { name: "#general-chat", desc: "Interact with developers, share ideas, and chat.", posts: 142, icon: Users },
    { name: "#bugs-and-fixes", desc: "Report repository bugs and collaborate on fixes.", posts: 56, icon: FileCode2 },
    { name: "#help-desk", desc: "Stuck on an issue? Ask mentors and peers for support.", posts: 98, icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#06091b] text-white font-sans overflow-hidden relative">
      {/* Space aura background highlight glows */}
      <div className="absolute top-20 left-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-16 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section 1: Hero Welcome Banner */}
          <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl mb-8">
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-30 scale-105" />
                  <div className="relative w-20 h-20 rounded-full bg-[#131947] border border-white/10 flex items-center justify-center text-2xl font-bold font-mono text-white">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                    Welcome, {user.name.split(" ")[0]}! <Sparkles className="text-yellow-400" size={20} />
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed max-w-lg font-light">
                    Explore code repos, track your progress, and collaborate in our active open-source cohort.
                  </p>

                  {/* Small Profile Pills */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-white/5 text-[10px] text-slate-400 font-mono">
                      Email: {user.email}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono uppercase font-bold tracking-wider">
                      Role: {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Metrics Tracker */}
              <div className="flex gap-4 p-4 rounded-2xl bg-[#06091b]/50 border border-white/[0.03] text-left">
                <div className="pr-4 border-r border-white/5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Commits</div>
                  <div className="text-2xl font-extrabold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">PRs Merged</div>
                  <div className="text-2xl font-extrabold text-white mt-1">0</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Column (2 spans): Community Join & Channels */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Join State Panel */}
              {!user.isCommunityJoined ? (
                <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl opacity-50" />

                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    Join the Developer Hub <Users size={20} className="text-indigo-400" />
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light max-w-lg">
                    Join our unified community workspace. Unlock shared Discord developer chats, secure early access to codebases, and claim contribution issues directly from program maintainers.
                  </p>

                  <button
                    disabled={joining}
                    onClick={handleJoinCommunity}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-bold text-sm text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {joining ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Join Community <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-[#0c102b]/40 border border-emerald-500/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    Community Joined! <CheckCircle2 size={20} className="text-emerald-400" />
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    You are officially a member of the cohort community workspace. Start interacting with mentors and claim issues.
                  </p>

                  {/* Resource Access Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href="https://discord.gg/altraverse"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900/40 hover:bg-slate-900 border border-white/[0.04] hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">Discord Server</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Chat with cohort members</div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 group-hover:text-white transition" />
                    </a>

                    <a
                      href="https://github.com/altraverse"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900/40 hover:bg-slate-900 border border-white/[0.04] hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <Github size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">GitHub Organization</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Browse project source code</div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 group-hover:text-white transition" />
                    </a>
                  </div>
                </div>
              )}

              {/* Forum Channels Section */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  Forum Discussion Categories <Compass size={18} className="text-indigo-400" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {channels.map((chan, idx) => {
                    const Icon = chan.icon;
                    return (
                      <div key={idx} className="bg-[#0c102b]/40 border border-white/[0.05] rounded-2xl p-5 hover:border-white/10 transition flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className="text-indigo-400" />
                            <h4 className="font-bold text-sm text-white font-mono">{chan.name}</h4>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed font-light">{chan.desc}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                          <span className="text-[10px] text-slate-500 font-mono">{chan.posts} active threads</span>
                          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                            Open Channel <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Leaderboard Panel */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md shadow-2xl relative">
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                  Cohort Leaderboard <Trophy className="text-yellow-500" size={18} />
                </h3>
                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-6">
                  Top Contributors of the Month
                </p>

                {/* Leader list */}
                <div className="space-y-4">
                  {leaderboard.map((leader) => (
                    <div key={leader.rank} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.02] transition">
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs font-mono ${leader.rank === 1
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : leader.rank === 2
                            ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                            : leader.rank === 3
                              ? "bg-amber-600/20 text-amber-300 border border-amber-600/30"
                              : "text-slate-500"
                          }`}>
                          {leader.rank}
                        </span>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-[#131947] border border-white/5 flex items-center justify-center font-bold text-xs text-white">
                          {leader.avatar}
                        </div>

                        {/* Details */}
                        <div>
                          <div className="text-xs font-semibold text-white">{leader.name}</div>
                          <div className="text-[9px] text-slate-500 font-mono uppercase mt-0.5">{leader.role}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-indigo-400 font-mono">{leader.points} pts</div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">{leader.commits} commits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cohort Schedule Panel */}
              <div className="bg-[#0c102b]/25 border border-white/[0.03] rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono mb-4 flex items-center gap-1.5">
                  Upcoming Meetups <Clock size={12} />
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900/30 rounded-xl border border-white/5">
                    <div className="text-xs font-bold text-white">ASOC Cohort Kickoff Meeting</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">July 5th, 2026 - 6:00 PM IST</div>
                  </div>
                  <div className="p-3 bg-slate-900/30 rounded-xl border border-white/5">
                    <div className="text-xs font-bold text-white">Open Source Contribution Workshop</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">July 12th, 2026 - 4:00 PM IST</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
