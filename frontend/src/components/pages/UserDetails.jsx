import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  User,
  Mail,
  Star,
  Trophy,
  GitBranch,
  Globe,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  GraduationCap,
  Sparkles,
  Code2,
  Megaphone,
  Terminal,
  ShieldAlert,
  Send,
  Users,
  ExternalLink,
  GitPullRequest
} from "lucide-react";

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  // Award Points Form State
  const [pointsAmount, setPointsAmount] = useState("");
  const [pointsReason, setPointsReason] = useState("");
  const [awarding, setAwarding] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState("");
  const [awardError, setAwardError] = useState("");

  // Action Loading state for application approvals/rejections on details page
  const [actionLoading, setActionLoading] = useState({});

  // Prepare points history displaying legacy points if they exist
  const getPointsHistoryToDisplay = () => {
    if (!profile) return [];
    const history = [...(profile.pointsHistory || [])];
    const sumHistory = history.reduce((acc, item) => acc + item.points, 0);
    const legacyPoints = (profile.points || 0) - sumHistory;
    if (legacyPoints > 0) {
      history.unshift({
        points: legacyPoints,
        reason: "LinkedIn Post Sharing",
        createdAt: profile.createdAt || new Date()
      });
    }
    return history;
  };
  const pointsHistoryToDisplay = getPointsHistoryToDisplay();

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      navigate("/roles", { replace: true });
      return;
    }
    fetchUserDetails();
  }, [userId, currentUser]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get(`/api/roles/admin/users/${userId}/details`);
      if (response.data.success) {
        setProfile(response.data.user);
        setApplications(response.data.applications);
      } else {
        setError(response.data.message || "Failed to load user details.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred while fetching user data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    if (!pointsAmount || isNaN(pointsAmount) || parseInt(pointsAmount) <= 0) {
      setAwardError("Please enter a valid positive number.");
      return;
    }

    setAwarding(true);
    setAwardError("");
    setAwardSuccess("");

    try {
      const response = await API.post("/api/roles/admin/award-points", {
        userId,
        points: parseInt(pointsAmount),
        reason: pointsReason
      });

      if (response.data.success) {
        setAwardSuccess(`Successfully awarded ${pointsAmount} points!`);
        setPointsAmount("");
        setPointsReason("");
        // Reload details to get updated ranking and points
        fetchUserDetails();
      }
    } catch (err) {
      console.error(err);
      setAwardError(err.response?.data?.message || "Failed to award points.");
    } finally {
      setAwarding(false);
    }
  };

  const handleApplicationAction = async (appId, roleId, status) => {
    setActionLoading(prev => ({ ...prev, [appId]: true }));
    try {
      const endpoint = status === "approve" ? "/api/roles/admin/approve" : "/api/roles/admin/reject";
      const response = await API.post(endpoint, { applicationId: appId, roleId });

      if (response.data.success) {
        // Refresh local applications
        setApplications(prev =>
          prev.map(app => (app._id === appId ? { ...app, status: status === "approve" ? "approved" : "rejected" } : app))
        );
        fetchUserDetails(); // Refresh profile values
      }
    } catch (err) {
      console.error("Application action error:", err);
      alert(err.response?.data?.message || "Failed to update application status.");
    } finally {
      setActionLoading(prev => ({ ...prev, [appId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06091b] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-xs mt-4 font-mono">Retrieving member details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#06091b] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center max-w-md mx-auto px-4 text-center">
          <ShieldAlert className="text-rose-500 mb-4 animate-bounce" size={48} />
          <h2 className="text-xl font-bold mb-2">Access Error</h2>
          <p className="text-slate-400 text-sm font-light mb-6">
            {error || "We could not find details for this user."}
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg transition duration-200"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get Role Icon Helper
  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case "contributor":
        return Code2;
      case "ambassador":
        return Megaphone;
      case "project-admin":
        return Terminal;
      default:
        return User;
    }
  };

  return (
    <div className="min-h-screen bg-[#06091b] text-white flex flex-col justify-between font-sans selection:bg-indigo-500/30 relative">
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 opacity-15"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(99,102,241,0.25) 0%, transparent 70%)" }}
      />

      <Navbar />

      <main className="relative z-10 flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition duration-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            BACK TO ADMIN PANEL
          </Link>
        </div>

        {/* User Card Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: User Core Stats & Points Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* profile Summary Card */}
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />
              
              <div className="flex flex-col items-center text-center">
                {/* Avatar / Initial */}
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-3xl shadow-lg mb-4">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">{profile.email}</p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {(profile.roles && profile.roles.length > 0 ? profile.roles : [profile.role]).filter(Boolean).map((r, rIdx) => (
                    <span
                      key={rIdx}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase border ${
                        r === "admin"
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                          : r === "ambassador"
                            ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                            : r === "contributor"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* stats list */}
              <div className="mt-8 border-t border-white/5 pt-6 space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Cohort Points:</span>
                  <span className="font-mono font-extrabold text-indigo-400 text-lg flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> {profile.points || 0} PTS
                  </span>
                </div>
                {profile.githubUsername && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">GitHub Account:</span>
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-indigo-400 hover:underline flex items-center gap-1.5 font-bold"
                    >
                      <GitBranch size={14} /> @{profile.githubUsername}
                    </a>
                  </div>
                )}
                {profile.college && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">College Name:</span>
                    <span className="text-slate-200 font-medium text-right max-w-[200px] truncate">
                      {profile.college}
                    </span>
                  </div>
                )}
                {profile.referralCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Referral Token:</span>
                    <span className="font-mono font-bold text-teal-400 bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/15">
                      {profile.referralCode}
                    </span>
                  </div>
                )}
                {profile.referralsCount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Referral Count:</span>
                    <span className="font-mono text-slate-200">{profile.referralsCount} signups</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rankings Card */}
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-white mb-6 flex items-center gap-2">
                <Trophy className="text-amber-400" size={18} /> Leaderboard Standings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Overall Rank</div>
                      <div className="text-[10px] text-slate-500 font-mono">Cohort-wide</div>
                    </div>
                  </div>
                  <span className={`font-mono text-base font-extrabold ${profile.overallRank === "Unranked" ? "text-slate-500" : "text-indigo-400"}`}>
                    {profile.overallRank === "Unranked" ? "Unranked" : `#${profile.overallRank}`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <Megaphone size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Ambassador Rank</div>
                      <div className="text-[10px] text-slate-500 font-mono">Campus outreach</div>
                    </div>
                  </div>
                  <span className={`font-mono text-base font-extrabold ${profile.ambassadorRank === "N/A" || profile.ambassadorRank === "Unranked" ? "text-slate-500" : "text-rose-400"}`}>
                    {profile.ambassadorRank}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Code2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Contributor Rank</div>
                      <div className="text-[10px] text-slate-500 font-mono">Code submissions</div>
                    </div>
                  </div>
                  <span className={`font-mono text-base font-extrabold ${profile.contributorRank === "N/A" || profile.contributorRank === "Unranked" ? "text-slate-500" : "text-blue-400"}`}>
                    {profile.contributorRank}
                  </span>
                </div>
              </div>
            </div>

            {/* Award Points Tool Box */}
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-white mb-4 flex items-center gap-2">
                <Star className="text-indigo-400" size={18} fill="currentColor" /> Award Points Manually
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-light">
                Award points to this member for external tasks, social posts, or code repository contributions.
              </p>

              {awardSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {awardSuccess}
                </div>
              )}
              {awardError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {awardError}
                </div>
              )}

              <form onSubmit={handleAwardPoints} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Points Amount</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                    className="w-full bg-[#06091b] border border-white/5 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Reason / Memo (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Badge Shared on LinkedIn"
                    value={pointsReason}
                    onChange={(e) => setPointsReason(e.target.value)}
                    className="w-full bg-[#06091b] border border-white/5 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={awarding}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition duration-200 cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {awarding ? "Updating..." : <>Award Points <Send size={12} /></>}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT PANEL: Role Track Applications (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />
              
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Award className="text-indigo-400" size={20} /> Submission Cohort Tracks
              </h3>
              <p className="text-xs text-slate-400 mb-8 font-light">
                Track and manage this user's registrations and applications.
              </p>

              {applications.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  <Clock className="mx-auto mb-4 opacity-30 animate-pulse" size={48} />
                  <p className="text-base font-semibold">No Submissions Found</p>
                  <p className="text-xs mt-1">This user hasn't submitted any role application requests yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => {
                    const AppIcon = getRoleIcon(app.roleId);
                    return (
                      <div
                        key={app._id}
                        className="p-5 sm:p-6 rounded-2xl bg-slate-900/30 border border-white/5 space-y-4 hover:border-white/10 transition duration-200"
                      >
                        {/* Header: Track Name & Badge status */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                              <AppIcon size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-white capitalize">{app.roleId} Track</h4>
                              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                Submitted {new Date(app.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {app.status === "approved" ? (
                              <>
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span className="font-semibold text-emerald-400 text-xs font-mono">Approved</span>
                              </>
                            ) : app.status === "rejected" ? (
                              <>
                                <XCircle size={16} className="text-red-400" />
                                <span className="font-semibold text-red-400 text-xs font-mono">Rejected</span>
                              </>
                            ) : (
                              <>
                                <Clock size={16} className="text-amber-400 animate-pulse" />
                                <span className="font-semibold text-amber-400 text-xs font-mono">Pending</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Details Details Fields */}
                        <div className="text-xs bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2 font-sans text-slate-300">
                          {app.github && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">GitHub:</span>
                              <a
                                href={app.github.startsWith("http") ? app.github : `https://github.com/${app.github}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:underline"
                              >
                                {app.github}
                              </a>
                            </div>
                          )}
                          {app.linkedin && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">LinkedIn:</span>
                              <a
                                href={app.linkedin.startsWith("http") ? app.linkedin : `https://linkedin.com/in/${app.linkedin}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:underline"
                              >
                                {app.linkedin}
                              </a>
                            </div>
                          )}
                          {app.phone && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">Mobile Number:</span>
                              <span className="text-slate-200 font-medium">{app.phone}</span>
                            </div>
                          )}
                          {app.college && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">College/Year:</span>
                              <span>{app.college} ({app.year})</span>
                            </div>
                          )}
                          {app.techStack && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">Tech Stack:</span>
                              <span className="text-slate-200 font-medium">{app.techStack}</span>
                            </div>
                          )}
                          {app.projects && Array.isArray(app.projects) && app.projects.some(proj => proj.projectName || proj.repoUrl) ? (
                            <div className="mt-3 border-t border-white/5 pt-3 space-y-2">
                              <span className="text-slate-500 font-mono block text-[10px] uppercase tracking-wider mb-2">Projects Submitted:</span>
                              {app.projects.map((proj, pIdx) => (
                                <div key={pIdx} className="text-xs flex flex-col sm:flex-row gap-1">
                                  <span className="font-semibold text-slate-200 shrink-0">#{pIdx + 1} {proj.projectName}</span>
                                  {proj.repoUrl && (
                                    <span className="text-slate-500 truncate">
                                      {" - "}
                                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-mono text-[11px]">
                                        {proj.repoUrl}
                                      </a>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <>
                              {app.projectName && (
                                <div className="flex items-start gap-2">
                                  <span className="text-slate-500 font-mono w-24 shrink-0">Project Title:</span>
                                  <span>{app.projectName}</span>
                                </div>
                              )}
                              {app.repoUrl && (
                                <div className="flex items-start gap-2">
                                  <span className="text-slate-500 font-mono w-24 shrink-0">Repository:</span>
                                  <a href={app.repoUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                    {app.repoUrl}
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                          {app.referredBy && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 font-mono w-24 shrink-0">Referred By:</span>
                              <span className="font-mono text-teal-400 font-bold">{app.referredBy}</span>
                            </div>
                          )}
                          {app.motivation && (
                            <div className="mt-3 p-3 bg-slate-950/60 rounded border border-white/5 italic text-slate-400 leading-relaxed font-light">
                              "{app.motivation}"
                            </div>
                          )}
                        </div>

                        {/* Interactive Approvals/Rejections on details view */}
                        {app.status === "pending" && (
                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              disabled={actionLoading[app._id]}
                              onClick={() => handleApplicationAction(app._id, app.roleId, "approve")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-50 cursor-pointer"
                            >
                              <CheckCircle2 size={14} /> Approve Track
                            </button>
                            <button
                              disabled={actionLoading[app._id]}
                              onClick={() => handleApplicationAction(app._id, app.roleId, "reject")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle size={14} /> Reject Track
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Code Contributions & Merged Pull Requests Card */}
            {(profile.role === "contributor" ||
              (profile.roles && profile.roles.includes("contributor")) ||
              (profile.solvedIssuesCount && profile.solvedIssuesCount > 0) ||
              (profile.contributorContributions && profile.contributorContributions.length > 0)) && (
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GitPullRequest className="text-blue-400" size={20} /> Code Contributions & Merged PRs
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {profile.solvedIssuesCount || 0} Merged
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-6 font-light">
                  GitHub pull requests merged and points awarded to this Contributor.
                </p>

                {(!profile.contributorContributions || profile.contributorContributions.length === 0) ? (
                  <div className="py-8 text-center text-slate-500 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                    <p className="text-xs font-light">No merged pull requests logged yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {[...profile.contributorContributions].reverse().map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition duration-200 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <GitPullRequest size={15} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white line-clamp-1">{item.reason}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-extrabold">
                            +{item.points} PTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Referred Developers Card */}
            {(profile.role === "ambassador" || (profile.roles && profile.roles.includes("ambassador"))) && (
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Users className="text-rose-400" size={20} /> Referred Developers
                </h3>
                <p className="text-xs text-slate-400 mb-6 font-light">
                  Developers who registered using this Ambassador's referral code.
                </p>

                {(!profile.referredUsersList || profile.referredUsersList.length === 0) ? (
                  <div className="py-8 text-center text-slate-500 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                    <p className="text-xs font-light">No referrals found for this Ambassador.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {[...profile.referredUsersList].reverse().map((refUser, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition duration-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-slate-300 text-xs">
                            {refUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{refUser.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{refUser.email}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(refUser.roles && refUser.roles.length > 0 ? refUser.roles : [refUser.role || "user"]).map((r) => (
                                <span key={r} className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-slate-400">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {refUser.isVerified ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold font-mono uppercase">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold font-mono uppercase animate-pulse">
                              Pending
                            </span>
                          )}
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(refUser.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Points History Card */}
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} /> Points History Log
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-light">
                A detailed breakdown of all points earned or manually awarded.
              </p>

              {pointsHistoryToDisplay.length === 0 ? (
                <div className="py-8 text-center text-slate-500 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                  <p className="text-xs font-light">No points earned yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {[...pointsHistoryToDisplay].reverse().map((hist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-900/30 rounded-xl border border-white/5 hover:border-white/10 transition duration-200 font-mono text-xs">
                      <span className={hist.points >= 0 ? "text-emerald-400 font-extrabold shrink-0" : "text-red-400 font-extrabold shrink-0"}>
                        {hist.points >= 0 ? `+${hist.points}` : hist.points} PTS
                      </span>
                      <span className="text-slate-300 text-left px-4 flex-grow truncate" title={hist.reason}>
                        {hist.reason}
                      </span>
                      <span className="text-slate-500 shrink-0 text-[10px]">
                        {new Date(hist.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
