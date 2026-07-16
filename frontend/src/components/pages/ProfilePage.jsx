import { useState, useEffect } from "react";
import { User, Mail, Calendar, CheckCircle2, Clock, XCircle, Award, Compass, ArrowRight, Shield } from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

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
                          className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-wider uppercase inline-flex items-center gap-1.5 border ${
                            r === "admin"
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
                </div>
              </div>

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
                           {app.projects && Array.isArray(app.projects) && app.projects.length > 0 ? (
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
