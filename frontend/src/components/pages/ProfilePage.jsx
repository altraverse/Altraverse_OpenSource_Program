import { useState, useEffect } from "react";
import { User, Mail, Calendar, CheckCircle2, Clock, XCircle, Award, Compass, ArrowRight, Shield, Trophy, Sparkles, Copy, Check, Users } from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function ProfilePage() {
  const { user, setUser, loading, fetchMe } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Referral States
  const [referralInput, setReferralInput] = useState("");
  const [referralError, setReferralError] = useState("");
  const [referralSuccess, setReferralSuccess] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCollege, setEditCollege] = useState("");
  const [editGithubUsername, setEditGithubUsername] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setUpdateError("Full Name is required.");
      return;
    }
    setUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const res = await API.put("/api/auth/profile", {
        name: editName.trim(),
        college: editCollege.trim(),
        githubUsername: editGithubUsername.trim(),
        skills: editSkills,
      });

      if (res.data.success) {
        setUpdateSuccess("Profile updated successfully!");
        setUser(res.data.user);
        setTimeout(() => {
          setIsEditModalOpen(false);
          setUpdateSuccess("");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setUpdateError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferral = async (e) => {
    e.preventDefault();
    if (!referralInput.trim()) return;
    setApplyingReferral(true);
    setReferralError("");
    setReferralSuccess("");
    try {
      const res = await API.post("/api/auth/apply-referral", {
        referralCode: referralInput.trim()
      });
      if (res.data.success) {
        setReferralSuccess(res.data.message);
        setUser(prev => ({ ...prev, referredBy: res.data.referredBy }));
      }
    } catch (err) {
      console.error(err);
      setReferralError(err.response?.data?.message || "Failed to apply referral code.");
    } finally {
      setApplyingReferral(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setFetching(true);
      const res = await API.get("/api/roles/my-applications");
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your cohort track applications.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyApplications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-white">
        <h2 className="text-xl font-semibold">Loading Profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06091b] text-white flex-col gap-4">
        <h2 className="text-xl font-bold">Please log in to view your profile</h2>
        <Link to="/login" className="px-6 py-2 bg-indigo-600 rounded-full font-semibold">Log In</Link>
      </div>
    );
  }

  // Set avatar initials
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Prepare points history displaying legacy points if they exist
  const getPointsHistoryToDisplay = () => {
    const history = [...(user.pointsHistory || [])];
    const sumHistory = history.reduce((acc, item) => acc + item.points, 0);
    const legacyPoints = (user.points || 0) - sumHistory;
    if (legacyPoints > 0) {
      history.unshift({
        points: legacyPoints,
        reason: "LinkedIn Post Sharing",
        createdAt: user.createdAt || new Date()
      });
    }
    return history;
  };
  const pointsHistoryToDisplay = getPointsHistoryToDisplay();

  return (
    <div className="flex flex-col min-h-screen bg-[#06091b] text-white font-sans overflow-hidden relative">
      {/* Background glow highlights */}
      <div className="absolute top-20 left-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-16 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: User Identity Card */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                {/* Avatar Glow Ring */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-40 scale-105" />
                    <div className="relative w-24 h-24 rounded-full bg-[#131947] border-2 border-white/10 flex items-center justify-center text-3xl font-bold font-mono tracking-wide text-white">
                      {initials}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1.5">{user.name}</h2>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-4">
                    <Mail size={12} />
                    <span>{user.email}</span>
                  </div>

                  {/* Active Role pill badges */}
                  <div className="w-full mt-2 pt-4 border-t border-white/[0.05]">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2">Registered Roles</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(user.roles && user.roles.length > 0 ? user.roles : [user.role || "user"]).map((r) => (
                        <span
                          key={r}
                          className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-wider uppercase inline-flex items-center gap-1.5 border ${r === "admin"
                            ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                            : r === "contributor"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                              : r === "ambassador"
                                ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                : r === "project-admin"
                                  ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                  : r === "sponsor"
                                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                    : r === "mentor"
                                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                      : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                            }`}
                        >
                          {r === "admin" && <Shield size={10} />}
                          {r.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ambassador Referral code display */}
                  {(user.role === "ambassador" || (user.roles && user.roles.includes("ambassador"))) && (
                    <div className="mt-6 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="text-[9px] uppercase tracking-widest text-rose-400 font-mono font-bold">Your Referral Code</div>
                      <div className="flex items-center justify-center gap-2 mt-1.5">
                        <span className="text-xl font-bold font-mono text-white select-all tracking-wider">
                          {user.referralCode || "PENDING"}
                        </span>
                        {user.referralCode && (
                          <button
                            type="button"
                            onClick={handleCopyCode}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5 flex items-center justify-center"
                            title="Copy referral code"
                          >
                            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 mb-4 leading-normal font-light">Share this code to earn points on the Leaderboard!</p>

                      {/* Points & Stats Dashboard */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-left mb-4">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-[8px] font-mono uppercase text-slate-500">Total Points</div>
                          <div className="text-base font-extrabold text-white mt-0.5 flex items-center gap-1">
                            <Trophy size={14} className="text-yellow-500" />
                            {user.points || 0}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-[8px] font-mono uppercase text-slate-500">Total Referrals</div>
                          <div className="text-base font-extrabold text-white mt-0.5">
                            {user.referralsCount || 0}
                          </div>
                        </div>
                      </div>

                      {/* Referral Rules / Legend */}
                      <div className="border-t border-white/5 pt-3 text-left">
                        <div className="text-[9px] uppercase tracking-widest text-rose-400 font-mono font-bold mb-2">Referral Points System</div>
                        <div className="space-y-1.5 text-[10px] text-slate-400 font-mono">
                          <div className="flex justify-between items-center bg-white/[0.01] px-2 py-1 rounded">
                            <span>User Signup / Verify</span>
                            <span className="text-emerald-400 font-bold">+50 pts</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/[0.01] px-2 py-1 rounded">
                            <span>Contributor Referral</span>
                            <span className="text-emerald-400 font-bold">+30 pts</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/[0.01] px-2 py-1 rounded">
                            <span>Project Admin Referral</span>
                            <span className="text-emerald-400 font-bold">+60 pts</span>
                          </div>
                        </div>
                      </div>

                      {/* Referred Stats Breakdown */}
                      {user.referralStats && (
                        <div className="mt-4 border-t border-white/5 pt-3 text-left">
                          <div className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold mb-2">Your Referrals Breakdown</div>
                          <div className="space-y-1 text-[10px] text-slate-400 font-mono">
                            <div className="flex justify-between">
                              <span>Verified Signups:</span>
                              <span className="text-white font-bold">{user.referralStats.verifiedSignups || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contributor Approvals:</span>
                              <span className="text-white font-bold">{user.referralStats.contributors || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Project Admin Approvals:</span>
                              <span className="text-white font-bold">{user.referralStats.projectAdmins || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Link
                        to="/ambassador-leaderboard"
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-600/20 text-xs font-semibold text-rose-300 transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        <Trophy size={12} className="text-yellow-500" />
                        <span>Ambassador Leaderboard</span>
                      </Link>
                    </div>
                  )}

                  {/* Submit More Projects for Project Admin */}
                  {(user.role === "project-admin" || (user.roles && user.roles.includes("project-admin"))) && (
                    <Link
                      to="/roles/project-admin"
                      className="mt-6 w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-semibold text-purple-300 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <span>+ Submit Additional Project</span>
                    </Link>
                  )}
                </div>

                {/* Secondary Info Metadata */}
                <div className="mt-8 pt-6 border-t border-white/[0.05] space-y-3.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Type:</span>
                    <span className="text-slate-300">Local Auth</span>
                  </div>
                  {user.college && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">College:</span>
                      <span className="text-slate-300 text-right truncate max-w-[150px] font-sans" title={user.college}>
                        {user.college}
                      </span>
                    </div>
                  )}
                  {user.githubUsername && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">GitHub:</span>
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold transition-all"
                      >
                        @{user.githubUsername}
                      </a>
                    </div>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-2.5 border-t border-white/[0.03]">
                      <span className="text-slate-500">Skills:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1 font-sans">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name || "");
                      setEditCollege(user.college || "");
                      setEditGithubUsername(user.githubUsername || "");
                      setEditSkills(user.skills ? user.skills.join(", ") : "");
                      setIsEditModalOpen(true);
                      setUpdateError("");
                      setUpdateSuccess("");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-xs font-semibold text-indigo-300 hover:text-white transition-all cursor-pointer"
                  >
                    <User size={12} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>



              {/* Claim Referral Card */}
              {user && (
                <div className="bg-[#0c102b]/25 border border-white/[0.03] rounded-3xl p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-400" /> Claim Referral
                  </h3>

                  {user.referredBy ? (
                    <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Referred by:</span>
                      <span className="text-emerald-400 font-bold tracking-wider">{user.referredBy}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyReferral} className="mt-2.5">
                      <p className="text-[10px] text-slate-400 leading-normal font-light mb-3">
                        Enter a referral code from an Ambassador to support them and unlock community stats.
                      </p>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="E.g., REF123"
                          value={referralInput}
                          onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                          className="flex-grow bg-[#06091b]/50 border border-white/[0.08] hover:border-white/15 focus:border-indigo-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all font-mono tracking-wider"
                        />
                        <button
                          type="submit"
                          disabled={applyingReferral || !referralInput.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 disabled:text-slate-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                        >
                          {applyingReferral ? "Applying..." : "Claim"}
                        </button>
                      </div>

                      {referralError && (
                        <p className="mt-2 text-[10px] text-red-400 font-mono font-medium">{referralError}</p>
                      )}
                      {referralSuccess && (
                        <p className="mt-2 text-[10px] text-emerald-400 font-mono font-medium">{referralSuccess}</p>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* Quick Navigation Card */}
              <div className="bg-[#0c102b]/25 border border-white/[0.03] rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono mb-4">Quick Links</h3>
                <div className="flex flex-col gap-2.5">
                  <Link to="/roles" className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition group py-1.5">
                    <span>Explore Cohort Tracks</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition" />
                  </Link>
                  <Link to="/projects" className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition group py-1.5">
                    <span>Browse Open Projects</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition" />
                  </Link>
                  <Link to="/resources" className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition group py-1.5">
                    <span>Program Resources</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition" />
                  </Link>
                  <Link to="/ambassador-leaderboard" className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition group py-1.5">
                    <span>Ambassador Leaderboard</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Applications Tracker (2 columns) */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Cohort Registrations <Award className="text-indigo-400" size={24} />
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Manage and review submitted track applications and live approval status.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {fetching ? (
                <div className="py-20 bg-[#0c102b]/20 border border-white/[0.04] rounded-3xl text-center">
                  <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 text-xs font-mono">Fetching active registrations...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="py-16 bg-[#0c102b]/20 border border-white/[0.04] rounded-3xl text-center">
                  <Compass className="mx-auto text-slate-600 mb-4 opacity-40 animate-pulse" size={40} />
                  <p className="text-base font-semibold text-slate-400">No Active Applications</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed font-light">
                    You have not registered for any cohort tracks yet. Head to the roles selector and choose your path!
                  </p>
                  <Link to="/roles" className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 transition-colors">
                    Choose a Role <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <div key={app._id} className="bg-[#0c102b]/40 border border-white/[0.05] rounded-2xl p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition hover:border-white/10">
                      <div>
                        {/* Title Row */}
                        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                          <h3 className="font-bold text-white uppercase font-mono tracking-wider text-xs">
                            {app.roleId.replace("-", " ")} APPLICATION
                          </h3>

                          {/* Status Pill */}
                          <div className="flex items-center gap-1">
                            {app.status === "approved" ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase flex items-center gap-0.5">
                                <CheckCircle2 size={10} /> Approved
                              </span>
                            ) : app.status === "rejected" ? (
                              <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-0.5">
                                <XCircle size={10} /> Declined
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono uppercase flex items-center gap-0.5 animate-pulse">
                                <Clock size={10} /> Pending Review
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Submission Metadata Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400 leading-normal">
                          {app.phone && (
                            <div>
                              <span className="text-slate-500">Mobile:</span> <span className="text-slate-300 font-mono">{app.phone}</span>
                            </div>
                          )}
                          {app.github && (
                            <div>
                              <span className="text-slate-500">GitHub:</span> <span className="text-slate-300 font-mono">{app.github}</span>
                            </div>
                          )}
                          {app.techStack && (
                            <div>
                              <span className="text-slate-500">Tech Stack:</span> <span className="text-slate-300">{app.techStack}</span>
                            </div>
                          )}
                          {app.college && (
                            <div>
                              <span className="text-slate-500">College:</span> <span className="text-slate-300">{app.college}</span>
                            </div>
                          )}
                          {app.projects && Array.isArray(app.projects) && app.projects.some(proj => proj.projectName || proj.repoUrl) ? (
                            <div className="col-span-1 sm:col-span-2 mt-1">
                              <span className="text-slate-500 block mb-1">Submitted Projects:</span>
                              <div className="pl-3 border-l-2 border-purple-500/30 space-y-1">
                                {app.projects.map((proj, pIdx) => (
                                  <div key={pIdx} className="text-xs">
                                    <span className="text-slate-300 font-semibold">{proj.projectName}</span>
                                    {proj.repoUrl && (
                                      <span className="text-slate-500">
                                        {" - "}
                                        <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-mono text-[11px]">
                                          {proj.repoUrl}
                                        </a>
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            app.projectName && (
                              <div>
                                <span className="text-slate-500">Project:</span> <span className="text-slate-300">{app.projectName}</span>
                              </div>
                            )
                          )}
                          {app.company && (
                            <div>
                              <span className="text-slate-500">Company:</span> <span className="text-slate-300">{app.company}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Link */}
                      <Link
                        to={`/roles/${app.roleId}`}
                        className="px-4 py-2 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-mono font-bold text-slate-300 hover:text-white rounded-xl transition text-center"
                      >
                        VIEW DETAIL
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Referred Developers Card */}
              {(user.role === "ambassador" || (user.roles && user.roles.includes("ambassador"))) && (
                <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Users className="text-rose-400" size={20} /> Referred Developers
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-light">
                    Developers who signed up using your referral code.
                  </p>

                  {(!user.referredUsersList || user.referredUsersList.length === 0) ? (
                    <div className="py-8 text-center text-slate-500 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                      <p className="text-xs font-light">No referrals yet. Share your code to invite developers!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {[...user.referredUsersList].reverse().map((refUser, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition duration-200 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-slate-300 text-xs">
                              {refUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{refUser.name}</div>
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
                  A detailed breakdown of all points earned on the platform.
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
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#0c102b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <XCircle size={18} />
              </button>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" /> Edit Profile Settings
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-light leading-relaxed">
                Update your personal information to build your developer reputation and complete your profile.
              </p>

              {updateError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {updateSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-2">Full Name <span className="text-red-400">*</span></label>
                  <input
                    required
                    type="text"
                    placeholder="E.g., Jane Doe"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#06091b]/50 border border-white/[0.08] hover:border-white/15 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-2">College Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Stanford University"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full bg-[#06091b]/50 border border-white/[0.08] hover:border-white/15 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-2">GitHub Username</label>
                  <input
                    type="text"
                    placeholder="E.g., janedoe"
                    value={editGithubUsername}
                    onChange={(e) => setEditGithubUsername(e.target.value)}
                    className="w-full bg-[#06091b]/50 border border-white/[0.08] hover:border-white/15 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-2">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="E.g., React, Node.js, Python"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full bg-[#06091b]/50 border border-white/[0.08] hover:border-white/15 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all font-mono"
                  />
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal font-light">Separate skills with commas (e.g. JavaScript, CSS, HTML)</p>
                </div>

                <div className="pt-4 border-t border-white/[0.05] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 disabled:text-slate-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
