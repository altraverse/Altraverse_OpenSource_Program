import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Plus, 
  GitFork, 
  Star, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  Info, 
  ExternalLink,
  Users
} from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [section, setSection] = useState("applications"); // "applications" or "projects"
  
  // Applications State
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});

  // Projects State
  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [projectAdmins, setProjectAdmins] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState(null);
  const [copiedText, setCopiedText] = useState("");

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [fetchingTickets, setFetchingTickets] = useState(false);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [updatingTicket, setUpdatingTicket] = useState({});

  // Add Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    tag: "Fullstack",
    color: "violet",
    githubUrl: "",
    projectAdmin: "",
    description: "",
    points: 100,
    techStack: "",
    image: "",
  });

  const handleDownload = async (fileType) => {
    try {
      const response = await API.get(`/api/roles/admin/download-excel?fileType=${fileType}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        fileType === "mentors" ? "mentor_applications.xlsx" : "role_applications.xlsx"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download spreadsheet. It might not have been generated yet.");
    }
  };

  const fetchApplications = async () => {
    try {
      setFetching(true);
      const response = await API.get("/api/roles/admin/applications");
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch applications. Please check admin permissions.");
    } finally {
      setFetching(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setFetchingProjects(true);
      const response = await API.get("/api/projects");
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setFetchingProjects(false);
    }
  };

  const fetchProjectAdmins = async () => {
    try {
      const response = await API.get("/api/projects/admins/list");
      if (response.data.success) {
        setProjectAdmins(response.data.admins);
      }
    } catch (err) {
      console.error("Failed to load project admins:", err);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchApplications();
      fetchProjects();
      fetchProjectAdmins();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setFetchingTickets(true);
      const response = await API.get(`/api/support/admin/tickets?status=${ticketFilter}`);
      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load support tickets.");
    } finally {
      setFetchingTickets(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    setUpdatingTicket((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const response = await API.put(`/api/support/admin/tickets/${ticketId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update ticket status.");
    } finally {
      setUpdatingTicket((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  useEffect(() => {
    if (user && user.role === "admin" && section === "support") {
      fetchTickets();
    }
  }, [user, section, ticketFilter]);

  const handleAction = async (applicationId, roleId, action) => {
    setActionLoading((prev) => ({ ...prev, [applicationId]: true }));
    try {
      const endpoint = `/api/roles/admin/${action}`; // approve or reject
      const response = await API.post(endpoint, {
        applicationId,
        roleId,
      });

      if (response.data.success) {
        // Update local state status
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId
              ? { ...app, status: action === "approve" ? "approved" : "rejected" }
              : app
          )
        );
        // Refresh project admins list in case someone was newly approved as a project-admin
        if (roleId === "project-admin" && action === "approve") {
          fetchProjectAdmins();
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSelectChange = (e) => {
    const adminId = e.target.value;
    const selectedAdmin = projectAdmins.find((adm) => adm._id === adminId);
    
    if (selectedAdmin && selectedAdmin.application) {
      const apps = selectedAdmin.application;
      const projectsList = apps.projects && apps.projects.length > 0
        ? apps.projects
        : [{ projectName: apps.projectName, repoUrl: apps.repoUrl }];
      
      setSelectedProjects(projectsList);
      
      // Auto-prefill with first project
      const firstProj = projectsList[0];
      setNewProject((prev) => ({
        ...prev,
        projectAdmin: adminId,
        title: firstProj.projectName || prev.title,
        githubUrl: firstProj.repoUrl || prev.githubUrl,
        techStack: apps.techStack || prev.techStack,
        description: apps.description || prev.description,
      }));
    } else {
      setSelectedProjects([]);
      setNewProject((prev) => ({
        ...prev,
        projectAdmin: adminId,
      }));
    }
  };

  const handleProjectSelectChange = (e) => {
    const pIdx = e.target.value;
    if (pIdx !== "" && selectedProjects[pIdx]) {
      const proj = selectedProjects[pIdx];
      setNewProject((prev) => ({
        ...prev,
        title: proj.projectName,
        githubUrl: proj.repoUrl,
      }));
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    setError("");

    try {
      const response = await API.post("/api/projects", newProject);
      if (response.data.success) {
        // Add to local projects state
        const p = response.data.project;
        setProjects((prev) => [
          ...prev,
          {
            id: p._id,
            title: p.title,
            tag: p.tag,
            color: p.color,
            points: p.points,
            image: p.image,
            description: p.description,
            stars: p.stars,
            forks: p.forks,
            date: "0 Issues open",
          },
        ]);
        
        // Show webhook configuration dialog
        setWebhookConfig(response.data.webhookConfig);
        setShowAddModal(false);
        
        // Reset form
        setNewProject({
          title: "",
          tag: "Fullstack",
          color: "violet",
          githubUrl: "",
          projectAdmin: "",
          description: "",
          points: 100,
          techStack: "",
          image: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add project. Please verify inputs.");
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-white">
        <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/roles" replace />;
  }

  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    if (filter === "pending") return app.status === "pending";
    if (filter === "approved") return app.status === "approved";
    if (filter === "rejected") return app.status === "rejected";
    return app.roleId === filter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#06091b] text-white font-sans">
      <Navbar />

      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/[0.05] pb-6">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                Admin Panel <ShieldCheck className="text-indigo-400" size={28} />
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Approve platform tracks and configure repository project hooks.
              </p>
            </div>

            {/* Section Switcher Tabs */}
            <div className="flex bg-[#0c102b] border border-white/5 rounded-xl p-1">
              <button
                onClick={() => setSection("applications")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer ${
                  section === "applications"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText size={14} /> Applications
              </button>
              <button
                onClick={() => setSection("projects")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer ${
                  section === "projects"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users size={14} /> Projects Sync
              </button>
              <button
                onClick={() => setSection("support")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer ${
                  section === "support"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Info size={14} /> Support Tickets
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* VIEW 1: Applications Listing Section */}
          {section === "applications" && (
            <>
              {/* Toolbar & Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownload("roles")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer"
                  >
                    <Download size={14} /> Download Roles Log (.xlsx)
                  </button>
                  <button
                    onClick={() => handleDownload("mentors")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer"
                  >
                    <Download size={14} /> Download Mentors Log (.xlsx)
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["all", "pending", "approved", "rejected", "contributor", "ambassador", "project-admin", "sponsor", "mentor"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        filter === tab
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      {tab.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table List Container */}
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl relative">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                {fetching ? (
                  <div className="py-20 text-center">
                    <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading applications...</p>
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    <FileText className="mx-auto mb-4 opacity-30" size={48} />
                    <p className="text-lg font-semibold">No Applications Found</p>
                    <p className="text-sm mt-1">There are no submissions matching this filter.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto font-sans">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.05] text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/20">
                          <th className="py-4 px-6">Applicant</th>
                          <th className="py-4 px-6">Role Track</th>
                          <th className="py-4 px-6">Application Details</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
                        {filteredApps.map((app) => (
                          <tr key={app._id} className="hover:bg-white/[0.01] transition-colors">
                            {/* Applicant Column */}
                            <td className="py-5 px-6">
                              <div className="font-semibold text-white">{app.name}</div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{app.email}</div>
                              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </div>
                            </td>

                            {/* Role Track Column */}
                            <td className="py-5 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                                  app.roleId === "contributor"
                                    ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                    : app.roleId === "ambassador"
                                    ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                    : app.roleId === "project-admin"
                                    ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                    : app.roleId === "sponsor"
                                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                }`}
                              >
                                {app.roleId}
                              </span>
                            </td>

                            {/* Application Details Column */}
                            <td className="py-5 px-6 max-w-md">
                              <div className="space-y-1 text-xs">
                                {app.github && (
                                  <div>
                                    <span className="text-slate-500 font-mono">GitHub:</span>{" "}
                                    <a href={app.github.startsWith("http") ? app.github : `https://github.com/${app.github}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                      {app.github}
                                    </a>
                                  </div>
                                )}
                                {app.college && (
                                  <div>
                                    <span className="text-slate-500 font-mono">College:</span> {app.college} ({app.year})
                                  </div>
                                )}
                                {app.techStack && (
                                  <div>
                                    <span className="text-slate-500 font-mono">Tech Stack:</span>{" "}
                                    <span className="text-slate-300 font-medium">{app.techStack}</span>
                                  </div>
                                )}
                                {app.projects && Array.isArray(app.projects) && app.projects.length > 0 ? (
                                  <div className="mt-2 space-y-1.5 border-l-2 border-purple-500/30 pl-3">
                                    <div className="text-slate-500 font-mono text-[10px] uppercase tracking-wider mb-1">Submitted Projects:</div>
                                    {app.projects.map((proj, pIdx) => (
                                      <div key={pIdx} className="text-xs">
                                        <span className="font-semibold text-slate-300">#{pIdx + 1} {proj.projectName}</span>
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
                                ) : (
                                  <>
                                    {app.projectName && (
                                      <div>
                                        <span className="text-slate-500 font-mono">Project Name:</span> {app.projectName}
                                      </div>
                                    )}
                                    {app.repoUrl && (
                                      <div>
                                        <span className="text-slate-500 font-mono">Repo URL:</span>{" "}
                                        <a href={app.repoUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                          {app.repoUrl}
                                        </a>
                                      </div>
                                    )}
                                  </>
                                )}
                                {app.company && (
                                  <div>
                                    <span className="text-slate-500 font-mono">Company:</span> {app.company} ({app.tier})
                                  </div>
                                )}
                                {app.motivation && (
                                  <div className="mt-1.5 p-2 bg-slate-950/30 rounded border border-white/5 italic text-slate-400 max-h-24 overflow-y-auto">
                                    "{app.motivation}"
                                  </div>
                                )}
                                {app.message && (
                                  <div className="mt-1.5 p-2 bg-slate-950/30 rounded border border-white/5 italic text-slate-400 max-h-24 overflow-y-auto">
                                    "{app.message}"
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-1.5">
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
                                    <Clock size={16} className="text-amber-400" />
                                    <span className="font-semibold text-amber-400 text-xs font-mono">Pending</span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="py-5 px-6 text-right">
                              {app.status === "pending" ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    disabled={actionLoading[app._id]}
                                    onClick={() => handleAction(app._id, app.roleId, "approve")}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                                  >
                                    <UserCheck size={14} /> Approve
                                  </button>
                                  <button
                                    disabled={actionLoading[app._id]}
                                    onClick={() => handleAction(app._id, app.roleId, "reject")}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                                  >
                                    <UserX size={14} /> Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500 font-mono">Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* VIEW 2: Projects Management Section */}
          {section === "projects" && (
            <>
              {/* Header Button & Action */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400 text-sm font-medium">
                  Currently sync-monitoring {projects.length} repository projects
                </span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>

              {/* Projects List Table */}
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl relative">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                {fetchingProjects ? (
                  <div className="py-20 text-center">
                    <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading project configurations...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    <Users className="mx-auto mb-4 opacity-30" size={48} />
                    <p className="text-lg font-semibold">No Projects Registered</p>
                    <p className="text-sm mt-1">There are no project repositories registered yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.05] text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/20">
                          <th className="py-4 px-6">Project Title</th>
                          <th className="py-4 px-6">Track & Tags</th>
                          <th className="py-4 px-6">Stats (Live)</th>
                          <th className="py-4 px-6">Assigned Project Admin</th>
                          <th className="py-4 px-6 text-right">Repository URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-white/[0.01] transition-colors">
                            {/* Project Title & Issues */}
                            <td className="py-5 px-6">
                              <div className="font-semibold text-white">{project.title}</div>
                              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5 mt-1 inline-block font-mono">
                                {project.date}
                              </span>
                            </td>

                            {/* Track & Tags */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border bg-${project.color}-500/10 text-${project.color}-300 border-${project.color}-500/20`}>
                                  {project.tag}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">+{project.points} PTS</span>
                              </div>
                            </td>

                            {/* Live Stats */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-4 text-xs font-mono">
                                <span className="flex items-center gap-1 text-yellow-500/80">
                                  <Star size={12} /> {project.stars}
                                </span>
                                <span className="flex items-center gap-1 text-blue-400/80">
                                  <GitFork size={12} /> {project.forks}
                                </span>
                              </div>
                            </td>

                            {/* Assigned Project Admin */}
                            <td className="py-5 px-6">
                              {project.projectAdmin ? (
                                <div>
                                  <div className="font-medium text-slate-200">{project.projectAdmin.name}</div>
                                  <div className="text-xs text-slate-400 font-mono">@{project.projectAdmin.githubUsername || "github"}</div>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic text-xs">Unassigned</span>
                              )}
                            </td>

                            {/* Repository URL */}
                            <td className="py-5 px-6 text-right">
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono hover:underline cursor-pointer"
                              >
                                {project.githubOwner}/{project.githubRepo} <ExternalLink size={12} />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* VIEW 3: Support Tickets Section */}
          {section === "support" && (
            <>
              {/* Toolbar & Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <span className="text-slate-400 text-sm font-medium">
                  Currently managing {tickets.length} support requests
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {["all", "open", "in-progress", "resolved"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTicketFilter(tab)}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        ticketFilter === tab
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      {tab.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table List Container */}
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl relative">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                {fetchingTickets ? (
                  <div className="py-20 text-center">
                    <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading support tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    <Info className="mx-auto mb-4 opacity-30" size={48} />
                    <p className="text-lg font-semibold">No Support Tickets Found</p>
                    <p className="text-sm mt-1">There are no tickets matching this filter.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto font-sans">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.05] text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/20">
                          <th className="py-4 px-6">Sender Details</th>
                          <th className="py-4 px-6">Subject / Category</th>
                          <th className="py-4 px-6">Message Description</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
                        {tickets.map((ticket) => (
                          <tr key={ticket._id} className="hover:bg-white/[0.01] transition-colors">
                            {/* Sender Details */}
                            <td className="py-5 px-6">
                              <div className="font-semibold text-white">{ticket.name}</div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{ticket.email}</div>
                              {ticket.userId && (
                                <div className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[9px] font-mono text-indigo-300 uppercase mt-1">
                                  User Account
                                </div>
                              )}
                              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                {new Date(ticket.createdAt).toLocaleString()}
                              </div>
                            </td>

                            {/* Subject / Category */}
                            <td className="py-5 px-6">
                              <span className="text-xs font-semibold text-slate-200">
                                {ticket.subject}
                              </span>
                            </td>

                            {/* Message Description */}
                            <td className="py-5 px-6 max-w-md">
                              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-light">
                                {ticket.message}
                              </p>
                            </td>

                            {/* Status */}
                            <td className="py-5 px-6">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border tracking-wider ${
                                  ticket.status === "resolved"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : ticket.status === "in-progress"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-5 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <select
                                  disabled={updatingTicket[ticket._id]}
                                  value={ticket.status}
                                  onChange={(e) => handleUpdateTicketStatus(ticket._id, e.target.value)}
                                  className="bg-slate-950 border border-white/10 rounded-lg text-xs text-slate-300 px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                                >
                                  <option value="open">Open</option>
                                  <option value="in-progress">In-Progress</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Webhook Configuration Details Modal (Success State) */}
          {webhookConfig && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl">
                <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-t-3xl" />
                
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-emerald-400" size={24} /> Project Added Successfully!
                </h3>
                <p className="text-slate-400 text-xs mb-6">
                  Initial GitHub repository sync completed. Please share the details below with the Project Admin to register the live Webhook.
                </p>

                {/* Status card */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 mb-6 text-xs text-emerald-300">
                  Synced **{webhookConfig.syncedIssuesCount} open issues** from GitHub immediately.
                </div>

                <div className="space-y-4">
                  {/* Payload URL */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                      GitHub Webhook Payload URL
                    </label>
                    <div className="flex bg-slate-950/60 border border-white/5 rounded-xl overflow-hidden p-1">
                      <input
                        type="text"
                        readOnly
                        value={webhookConfig.payloadUrl}
                        className="flex-grow bg-transparent text-xs text-slate-300 font-mono px-3 focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopy(webhookConfig.payloadUrl, "url")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === "url" ? <Check size={14} /> : <Copy size={14} />} Copy
                      </button>
                    </div>
                  </div>

                  {/* Webhook Secret */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                      Webhook Secret Token
                    </label>
                    <div className="flex bg-slate-950/60 border border-white/5 rounded-xl overflow-hidden p-1">
                      <input
                        type="text"
                        readOnly
                        value={webhookConfig.secret}
                        className="flex-grow bg-transparent text-xs text-slate-300 font-mono px-3 focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopy(webhookConfig.secret, "secret")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === "secret" ? <Check size={14} /> : <Copy size={14} />} Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/[0.05] pt-5 flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                    <Info size={16} />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Project admins should configure this under **Repo Settings &rarr; Webhooks** on GitHub. Select **application/json** and check the **Issues**, **Forks**, and **Watch** events.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setWebhookConfig(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-white text-xs font-bold tracking-wide transition cursor-pointer"
                  >
                    Close & Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Project Form Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                
                <h3 className="text-xl font-bold text-white mb-1">
                  Add New Repository Project
                </h3>
                <p className="text-slate-400 text-xs mb-6 border-b border-white/[0.05] pb-4">
                  Fill in repo metadata to sync files, stars, and open issues logs automatically.
                </p>

                <form onSubmit={handleAddProject} className="space-y-4 font-sans">
                  
                  {/* Row 1: Title and Category Tag */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Project Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="E.g., TARS Web Core"
                        value={newProject.title}
                        onChange={handleFormChange}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category Tag</label>
                      <select
                        name="tag"
                        value={newProject.tag}
                        onChange={handleFormChange}
                        className="w-full bg-[#0c102b] border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      >
                        <option value="Fullstack">Fullstack</option>
                        <option value="Automation">Automation</option>
                        <option value="UI / UX">UI / UX</option>
                        <option value="DevOps">DevOps</option>
                        <option value="WebAssembly">WebAssembly</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Color and Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">UI Color Scheme</label>
                      <select
                        name="color"
                        value={newProject.color}
                        onChange={handleFormChange}
                        className="w-full bg-[#0c102b] border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      >
                        <option value="violet">Violet Glow</option>
                        <option value="emerald">Emerald Spark</option>
                        <option value="cyan">Cyan Ice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Points Multiplier (Multiplier Value)</label>
                      <input
                        type="number"
                        name="points"
                        min="0"
                        placeholder="E.g., 100"
                        value={newProject.points}
                        onChange={handleFormChange}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Row 3: Repository URL & Project Admin Select */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">GitHub Repository URL</label>
                      <input
                        type="url"
                        name="githubUrl"
                        required
                        placeholder="https://github.com/owner/repo"
                        value={newProject.githubUrl}
                        onChange={handleFormChange}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Assigned Project Admin</label>
                      <select
                        name="projectAdmin"
                        required
                        value={newProject.projectAdmin}
                        onChange={handleAdminSelectChange}
                        className="w-full bg-[#0c102b] border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      >
                        <option value="">-- Choose Approved Admin --</option>
                        {projectAdmins.map((adm) => (
                          <option key={adm._id} value={adm._id}>
                            {adm.name} (@{adm.githubUsername || adm.email.split("@")[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
 
                  {/* Selected Admin Projects Dropdown (only shown when multi-projects exist for selected admin) */}
                  {selectedProjects && selectedProjects.length > 1 && (
                    <div className="bg-[#0c102b]/40 border border-purple-500/20 rounded-2xl p-4">
                      <label className="block text-xs font-semibold text-purple-300 mb-1.5 font-mono">
                        Select Project to Sync (Admin submitted {selectedProjects.length} projects)
                      </label>
                      <select
                        onChange={handleProjectSelectChange}
                        className="w-full bg-[#06091b] border border-purple-500/30 hover:border-purple-500/50 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition cursor-pointer"
                      >
                        {selectedProjects.map((proj, pIdx) => (
                          <option key={pIdx} value={pIdx}>
                            {proj.projectName} ({proj.repoUrl})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Row 4: Tech Stack (CSV) and Custom Card Image URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        name="techStack"
                        placeholder="E.g., React, TypeScript, Docker"
                        value={newProject.techStack}
                        onChange={handleFormChange}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Card Image URL (optional)</label>
                      <input
                        type="text"
                        name="image"
                        placeholder="https://images.unsplash.com/... or blank"
                        value={newProject.image}
                        onChange={handleFormChange}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Description Box */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Brief Description</label>
                    <textarea
                      name="description"
                      required
                      rows="3"
                      placeholder="Detail the scope of development work, issues, and libraries..."
                      value={newProject.description}
                      onChange={handleFormChange}
                      className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="mt-8 border-t border-white/[0.05] pt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingProject}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition duration-250 disabled:opacity-50 cursor-pointer"
                    >
                      {submittingProject ? "Synchronizing Repo..." : "Register Project"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
