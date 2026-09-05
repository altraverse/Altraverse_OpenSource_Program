import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  Users, 
  GitPullRequest, 
  CircleDot, 
  ExternalLink, 
  Award, 
  Code,
  FileCode,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import API from "../../api/axios";
import { colorMap } from "./OrganisationCard";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, issues, contributors, prs

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/api/projects/${id}`);
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          setError("Project details not found.");
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-24">
          <div className="h-10 w-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs font-mono">Loading repo statistics & issue logs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-24">
          <h2 className="text-2xl font-bold text-white mb-2">{error || "Project Not Found"}</h2>
          <p className="text-white/40 mb-6 font-light">The project you are looking for does not exist or has been removed.</p>
          <Link 
            to="/projects" 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm text-gray-300 hover:text-white hover:border-white transition-all"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cm = colorMap[project.color] || colorMap.violet;

  // Render Stats Grid
  const renderStats = () => {
    const stats = [
      { icon: <Star className="text-yellow-500/80" size={18} />, label: "Stars", value: project.stars !== undefined && project.stars !== null ? project.stars : 0 },
      { icon: <GitFork className="text-blue-400/80" size={18} />, label: "Forks", value: project.forks !== undefined && project.forks !== null ? project.forks : 0 },
      { icon: <Users className="text-purple-400/80" size={18} />, label: "Contributors", value: project.detailedStats?.contributors ?? project.contributors?.length ?? 0 },
      { icon: <CircleDot className="text-red-400/80" size={18} />, label: "Open Issues", value: project.detailedStats?.openIssues ?? project.issues?.length ?? 0 },
      { icon: <GitPullRequest className="text-emerald-400/80" size={18} />, label: "PRs Merged", value: project.detailedStats?.prsMerged ?? project.prs?.length ?? 0 },
      { icon: <Layers className="text-cyan-400/80" size={18} />, label: "Commits", value: project.detailedStats?.totalCommits ?? 15 }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-[#0c102b]/40 border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/30 text-[10px] uppercase font-mono tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <span className="text-2xl font-bold tracking-tight font-mono text-white/90">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  // Difficulty tag helper
  const getDifficultyPill = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-300 border border-red-500/20";
      default:
        return "bg-white/5 text-white/70 border border-white/10";
    }
  };

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="relative overflow-hidden font-body">
      {/* Background Canvas / Glow Layer */}
      <div className="absolute inset-0 starfield pointer-events-none" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(ellipse at 50% 0%, ${cm.glow.replace("0.12", "0.2")} 0%, transparent 70%)` 
        }} 
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            BACK TO PARTICIPATING ORGANISATIONS
          </Link>
        </div>

        {/* Hero Header */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${cm.pill}`}>
                {project.tag}
              </span>
              <span className="font-mono text-xs text-white/30">
                Lines of Code: <strong className="text-white/60 font-medium">{project.detailedStats?.linesOfCode || "5.4K"}</strong>
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            
            <p className="text-white/50 text-base leading-relaxed max-w-3xl font-light mb-6">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Code size={14} className="text-white/30 mr-1" />
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider mr-2">Tech Stack:</span>
              {(project.detailedStats?.techStack || ["JavaScript"]).map((tech, idx) => (
                <span 
                  key={idx}
                  className="font-mono text-[10px] text-white/60 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Stats Grid */}
        {renderStats()}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.06] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "issues", label: `Open Issues (${project.issues?.length || 0})` },
            { id: "contributors", label: `Contributors (${project.contributors?.length || 0})` },
            { id: "prs", label: `Merged PRs (${project.prs?.length || 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === tab.id 
                  ? `border-white text-white` 
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Open Issues */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <CircleDot size={18} className="text-red-400" />
                    Featured Open Issues
                  </h3>
                  <button onClick={() => setActiveTab("issues")} className="text-xs text-white/40 hover:text-white transition-colors font-mono cursor-pointer">
                    VIEW ALL →
                  </button>
                </div>
                
                {project.issues && project.issues.length > 0 ? (
                  project.issues.slice(0, 3).map((issue) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-[#0c102b]/40 border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.1] hover:bg-[#0c102b]/60 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="font-mono text-[10px] text-white/30">{issue.number ? `#${issue.number}` : issue.id}</span>
                          <span className={`font-mono text-[8px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${getDifficultyPill(issue.difficulty)}`}>
                            {issue.difficulty}
                          </span>
                          <span className="font-mono text-[9px] text-white/20 flex items-center gap-1">
                            <Calendar size={10} /> {issue.date}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-white/80 leading-snug hover:text-white transition-colors">
                          {issue.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 sm:self-center self-end">
                        <div className="flex flex-col items-end">
                          <span className={`font-mono text-sm font-bold ${cm.text}`}>+{issue.points} PTS</span>
                          <span className="text-[10px] text-white/25">Reward Points</span>
                        </div>
                        {issue.link && (
                          <a 
                            href={issue.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/20 text-white/60 hover:text-white transition-all"
                            title="View on GitHub"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 rounded-2xl bg-[#0c102b]/20 border border-white/[0.04] text-xs text-white/40 font-mono">
                    No open issues at the moment.
                  </div>
                )}
              </div>

              {/* Right Side: Contributors & PR Activity */}
              <div className="flex flex-col gap-6">
                
                {/* Contributors Segment */}
                <div className="bg-[#0c102b]/20 border border-white/[0.04] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                    <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2">
                      <Users size={16} className="text-purple-400" />
                      Active Contributors
                    </h3>
                    <button onClick={() => setActiveTab("contributors")} className="text-[10px] text-white/40 hover:text-white transition-colors font-mono cursor-pointer">
                      SEE ALL
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {project.contributors && project.contributors.length > 0 ? (
                      project.contributors.slice(0, 4).map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full bg-[#131947] border border-white/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden flex-shrink-0">
                              {c.avatar || c.avatar_url ? (
                                <img 
                                  src={c.avatar || c.avatar_url} 
                                  alt={c.name || c.username} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <span 
                                className="absolute inset-0 flex items-center justify-center uppercase -z-10 text-[11px] font-bold" 
                                style={{ backgroundColor: c.avatarColor || "#8b5cf6" }}
                              >
                                {(c.name || c.username || "C").charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white/85 truncate max-w-[130px]">{c.name || c.username}</div>
                              {c.username ? (
                                <a
                                  href={`https://github.com/${c.username}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-indigo-400/80 hover:text-indigo-300 hover:underline flex items-center gap-0.5 font-mono"
                                >
                                  @{c.username} <ExternalLink size={8} />
                                </a>
                              ) : (
                                <div className="text-[10px] text-white/30">Contributor</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-mono font-bold text-white/85">+{c.points || 0} PTS</div>
                            <div className="text-[9px] text-white/30">{c.prCount || 1} {c.prCount === 1 ? 'PR' : 'PRs'} merged</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-white/40">
                        No active contributors yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* PR Merged Activity Segment */}
                <div className="bg-[#0c102b]/20 border border-white/[0.04] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                    <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2">
                      <GitPullRequest size={16} className="text-emerald-400" />
                      Merged PRs
                    </h3>
                    <button onClick={() => setActiveTab("prs")} className="text-[10px] text-white/40 hover:text-white transition-colors font-mono cursor-pointer">
                      SEE ALL
                    </button>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {project.prs && project.prs.length > 0 ? (
                      project.prs.slice(0, 3).map((pr, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <h4 className="text-xs font-medium text-white/80 leading-snug line-clamp-1">
                              {pr.link ? (
                                <a href={pr.link} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                                  {pr.title}
                                </a>
                              ) : (
                                pr.title
                              )}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-white/30">
                              <span>{pr.id}</span>
                              <span>·</span>
                              {pr.author ? (
                                <a 
                                  href={`https://github.com/${pr.author}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hover:text-indigo-400"
                                >
                                  by @{pr.author}
                                </a>
                              ) : (
                                <span>by @contributor</span>
                              )}
                              <span>·</span>
                              <span>{pr.date}</span>
                            </div>
                          </div>
                          <div className="font-mono text-[10px] text-emerald-400 font-bold whitespace-nowrap">
                            +{pr.points || 0}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-white/40">
                        No merged pull requests yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "issues" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-mono uppercase tracking-wide">
                  Showing {project.issues?.length || 0} available open issues
                </span>
              </div>
              {project.issues && project.issues.length > 0 ? (
                project.issues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0c102b]/40 border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.1] hover:bg-[#0c102b]/60 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-xs text-white/30">{issue.number ? `#${issue.number}` : issue.id}</span>
                        <span className={`font-mono text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${getDifficultyPill(issue.difficulty)}`}>
                          {issue.difficulty}
                        </span>
                        <span className="font-mono text-xs text-white/20 flex items-center gap-1">
                          <Calendar size={12} /> {issue.date}
                        </span>
                      </div>
                      <h4 className="font-semibold text-base text-white/85 hover:text-white transition-colors leading-snug">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-white/40 mt-1 font-light">
                        Click the external link icon to read requirements and submit your solution on Github.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:self-center self-end">
                      <div className="flex flex-col items-end">
                        <span className={`font-mono text-base font-bold ${cm.text}`}>+{issue.points} PTS</span>
                        <span className="text-[10px] text-white/25">Reward Points</span>
                      </div>
                      {issue.link && (
                        <a 
                          href={issue.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/20 text-white/60 hover:text-white transition-all"
                          title="View on GitHub"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 rounded-2xl bg-[#0c102b]/20 border border-white/[0.04] text-sm text-white/40 font-mono">
                  No open issues available for this repository.
                </div>
              )}
            </div>
          )}

          {activeTab === "contributors" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(project.contributors || []).map((c, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0c102b]/40 border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300"
                >
                  <div className="relative w-14 h-14 rounded-full bg-[#131947] border border-white/10 flex items-center justify-center text-lg font-bold text-white uppercase mb-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)] overflow-hidden">
                    {c.avatar || c.avatar_url ? (
                      <img 
                        src={c.avatar || c.avatar_url} 
                        alt={c.name || c.username} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span 
                      className="absolute inset-0 flex items-center justify-center uppercase -z-10 text-base font-bold" 
                      style={{ backgroundColor: c.avatarColor || "#8b5cf6" }}
                    >
                      {(c.name || c.username || "C").charAt(0)}
                    </span>
                  </div>
                  
                  <div className="font-semibold text-sm text-white/90 truncate max-w-full px-1">{c.name || c.username}</div>
                  {c.username && (
                    <a 
                      href={`https://github.com/${c.username}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-indigo-400/80 hover:text-indigo-300 hover:underline mb-3 inline-flex items-center gap-1 font-mono"
                    >
                      @{c.username} <ExternalLink size={10} />
                    </a>
                  )}
                  
                  <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-white/50 mb-4">
                    {c.role || "Contributor"}
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.03]">
                    <div className="text-center border-r border-white/[0.04]">
                      <div className="text-xs font-mono font-bold text-white/80">+{c.points || 0}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wide">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-mono font-bold text-white/80">{c.prCount || 1}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wide">PRs</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "prs" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-mono uppercase tracking-wide">
                  Showing {project.prs?.length || 0} pull requests merged recently
                </span>
              </div>
              {(project.prs || []).map((pr, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0c102b]/20 border border-white/[0.04] rounded-xl p-4 hover:bg-[#0c102b]/40 hover:border-white/[0.08] transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white/90 leading-tight">
                        {pr.link ? (
                          <a href={pr.link} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                            {pr.title}
                          </a>
                        ) : (
                          pr.title
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 font-mono text-xs text-white/30">
                        <span className="text-white/50 font-bold">{pr.id}</span>
                        <span>·</span>
                        {pr.author ? (
                          <a 
                            href={`https://github.com/${pr.author}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-indigo-400"
                          >
                            merged by @{pr.author}
                          </a>
                        ) : (
                          <span>merged by @contributor</span>
                        )}
                        <span>·</span>
                        <span>{pr.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div className="hidden sm:block">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                        {pr.status || "Merged"}
                      </span>
                    </div>
                    <div className="bg-[#0c102b]/60 border border-white/[0.05] rounded-lg px-3 py-1.5 text-center">
                      <div className="text-xs font-mono font-bold text-emerald-400">+{pr.points || 0}</div>
                      <div className="text-[8px] text-white/20 uppercase font-mono tracking-wider">PTS</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
