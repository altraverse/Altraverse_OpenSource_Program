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
  Users,
  Search,
  X,
  Edit
} from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [section, setSection] = useState("applications"); // "applications" or "projects"
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Applications State
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    contributor: 0,
    ambassador: 0,
    "project-admin": 0,
    sponsor: 0,
    mentor: 0
  });
  const [hasMoreApps, setHasMoreApps] = useState(false);
  const [loadingMoreApps, setLoadingMoreApps] = useState(false);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [projectAdmins, setProjectAdmins] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState(null);
  const [copiedText, setCopiedText] = useState("");

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [fetchingTickets, setFetchingTickets] = useState(false);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [updatingTicket, setUpdatingTicket] = useState({});

  // Award Points State
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [selectedUserForPoints, setSelectedUserForPoints] = useState(null);
  const [pointsAwardForm, setPointsAwardForm] = useState({
    points: 10,
    reason: ""
  });
  const [submittingPoints, setSubmittingPoints] = useState(false);
  const [pointsError, setPointsError] = useState("");
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);

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

  const fetchApplications = async (currentSkip = 0, isInitial = false, currentFilter = filter, currentSearch = searchQuery) => {
    const limit = 5;
    if (isInitial) {
      setFetching(true);
    } else {
      setLoadingMoreApps(true);
    }

    try {
      const response = await API.get(`/api/roles/admin/applications?skip=${currentSkip}&limit=${limit}&filter=${currentFilter}&search=${encodeURIComponent(currentSearch)}`);
      if (response.data.success) {
        if (isInitial) {
          setApplications(response.data.applications);
        } else {
          setApplications((prev) => [...prev, ...response.data.applications]);
        }
        setHasMoreApps(response.data.hasMore);
        if (response.data.counts) {
          setTabCounts(response.data.counts);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch applications. Please check admin permissions.");
    } finally {
      setFetching(false);
      setLoadingMoreApps(false);
    }
  };

  const searchQueryParam = debouncedSearchQuery.length >= 3 ? debouncedSearchQuery : "";

  const handleLoadMoreApps = () => {
    fetchApplications(applications.length, false, filter, searchQueryParam);
  };

  const fetchProjects = async () => {
    try {
      setFetchingProjects(true);
      const response = await API.get("/api/projects?all=true");
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

  const handleToggleProjectActive = async (projectId) => {
    try {
      const response = await API.patch(`/api/projects/${projectId}/toggle-active`);
      if (response.data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, isActive: response.data.isActive } : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle project status:", err);
      alert("Failed to toggle project status");
    }
  };

  const handleEditProjectClick = (project) => {
    setEditingProject({
      id: project.id,
      title: project.title,
      tag: project.tag,
      color: project.color,
      points: project.points,
      image: project.image,
      description: project.description,
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    setError("");

    try {
      const response = await API.put(`/api/projects/${editingProject.id}`, {
        title: editingProject.title,
        tag: editingProject.tag,
        color: editingProject.color,
        points: editingProject.points,
        image: editingProject.image,
        description: editingProject.description,
      });

      if (response.data.success) {
        setShowEditModal(false);
        setEditingProject(null);
        fetchProjects(); // Refresh the list
      }
    } catch (err) {
      console.error("Update project error:", err);
      setError(err.response?.data?.message || "Failed to update project. Please try again.");
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      if (isEditing) {
        setEditingProject({ ...editingProject, image: base64String });
      } else {
        setNewProject({ ...newProject, image: base64String });
      }
    };
    reader.readAsDataURL(file);
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
    if (user && user.role === "admin" && section === "applications") {
      fetchApplications(0, true, filter, searchQueryParam);
    }
  }, [user, filter, searchQueryParam, section]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProjects();
      fetchProjectAdmins();
    }
  }, [user]);

  useEffect(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, [section]);

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

  const fetchApprovedUsers = async (currentSkip = 0, isInitial = false, currentSearch = searchQuery) => {
    const limit = 10;
    if (isInitial) {
      setFetchingUsers(true);
    } else {
      setLoadingMoreUsers(true);
    }

    try {
      const response = await API.get(`/api/roles/admin/approved-users?skip=${currentSkip}&limit=${limit}&search=${encodeURIComponent(currentSearch)}`);
      if (response.data.success) {
        if (isInitial) {
          setApprovedUsers(response.data.users);
        } else {
          setApprovedUsers((prev) => [...prev, ...response.data.users]);
        }
        setHasMoreUsers(response.data.hasMore);
      }
    } catch (err) {
      console.error("Fetch approved users error:", err);
      setError("Failed to load approved user list.");
    } finally {
      setFetchingUsers(false);
      setLoadingMoreUsers(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin" && section === "points") {
      fetchApprovedUsers(0, true, searchQueryParam);
    }
  }, [user, section, searchQueryParam]);

  const handleLoadMoreUsers = () => {
    fetchApprovedUsers(approvedUsers.length, false, searchQueryParam);
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    if (!selectedUserForPoints) return;
    setSubmittingPoints(true);
    setPointsError("");
    try {
      const response = await API.post("/api/roles/admin/award-points", {
        userId: selectedUserForPoints._id,
        points: pointsAwardForm.points,
        reason: pointsAwardForm.reason
      });
      if (response.data.success) {
        alert(`Successfully awarded ${pointsAwardForm.points} points to ${selectedUserForPoints.name}!`);
        // Update points locally
        setApprovedUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUserForPoints._id
              ? { ...u, points: (u.points || 0) + parseInt(pointsAwardForm.points) }
              : u
          )
        );
        setSelectedUserForPoints(null);
        setPointsAwardForm({ points: 10, reason: "" });
      }
    } catch (err) {
      console.error(err);
      setPointsError(err.response?.data?.message || "Failed to award points.");
    } finally {
      setSubmittingPoints(false);
    }
  };

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

  const getTabCount = (tab) => {
    return tabCounts[tab] || 0;
  };

  const filteredApps = applications.filter(app => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      app.name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.roleId?.toLowerCase().includes(q) ||
      app.github?.toLowerCase().includes(q) ||
      app.college?.toLowerCase().includes(q) ||
      app.techStack?.toLowerCase().includes(q) ||
      app.projectName?.toLowerCase().includes(q) ||
      app.repoUrl?.toLowerCase().includes(q) ||
      app.linkedin?.toLowerCase().includes(q)
    );
  });

  const filteredProjectsList = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      p.title?.toLowerCase().includes(q) ||
      p.tag?.toLowerCase().includes(q) ||
      p.githubUrl?.toLowerCase().includes(q) ||
      p.githubOwner?.toLowerCase().includes(q) ||
      p.githubRepo?.toLowerCase().includes(q) ||
      p.projectAdmin?.name?.toLowerCase().includes(q) ||
      p.projectAdmin?.githubUsername?.toLowerCase().includes(q)
    );
  });

  const filteredTicketsList = tickets.filter(t => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q)
    );
  });

  const filteredUsersList = approvedUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.referralCode?.toLowerCase().includes(q) ||
      (u.roles && u.roles.some(r => r.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#06091b] text-white font-sans">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 px-3 sm:px-6 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Main Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/[0.05] pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
                Admin Panel <ShieldCheck className="text-indigo-400" size={26} />
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Approve platform tracks and configure repository project hooks.
              </p>
            </div>

            {/* Section Switcher Tabs */}
            <div className="flex bg-[#0c102b] border border-white/5 rounded-xl p-1 overflow-x-auto max-w-full no-scrollbar whitespace-nowrap">
              <button
                onClick={() => setSection("applications")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer shrink-0 ${section === "applications"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <FileText size={14} /> Applications
              </button>
              <button
                onClick={() => setSection("projects")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer shrink-0 ${section === "projects"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <Users size={14} /> Projects Sync
              </button>
              <button
                onClick={() => setSection("support")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer shrink-0 ${section === "support"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <Info size={14} /> Support Tickets
              </button>
              <button
                onClick={() => setSection("points")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer shrink-0 ${section === "points"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <Star size={14} /> Award Points
              </button>
            </div>
          </div>

          {/* Real-time Search Filter Bar */}
          <div className="mb-6 max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${section === "applications" ? "applications..." : section === "projects" ? "projects..." : section === "support" ? "support tickets..." : "approved users..."}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c102b] border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none transition shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
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
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => handleDownload("roles")}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    <Download size={14} /> Download Roles Log (.xlsx)
                  </button>
                  <button
                    onClick={() => handleDownload("mentors")}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    <Download size={14} /> Download Mentors Log (.xlsx)
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 no-scrollbar whitespace-nowrap">
                  {["all", "pending", "approved", "rejected", "contributor", "ambassador", "project-admin", "sponsor", "mentor"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer shrink-0 ${filter === tab
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-white/15"
                        }`}
                    >
                      {tab.replace("-", " ")} ({getTabCount(tab)})
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
                  <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto font-sans">
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
                               <Link to={`/admin/users/${app.userId?._id || app.userId}`} className="font-semibold text-white hover:text-indigo-400 hover:underline transition">
                                  {app.name}
                                </Link>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">{app.email}</div>
                                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                              </td>

                              {/* Role Track Column */}
                              <td className="py-5 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${app.roleId === "contributor"
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
                                  {app.phone && (
                                    <div>
                                      <span className="text-slate-500 font-mono">Mobile Number:</span>{" "}
                                      <span className="text-slate-300 font-medium">{app.phone}</span>
                                    </div>
                                  )}
                                  {app.github && (
                                    <div>
                                      <span className="text-slate-500 font-mono">GitHub:</span>{" "}
                                      <a href={app.github.startsWith("http") ? app.github : `https://github.com/${app.github}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                        {app.github}
                                      </a>
                                    </div>
                                  )}
                                  {app.linkedin && (
                                    <div>
                                      <span className="text-slate-500 font-mono">LinkedIn:</span>{" "}
                                      <a href={app.linkedin.startsWith("http") ? app.linkedin : `https://linkedin.com/in/${app.linkedin}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                        {app.linkedin}
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
                                  {app.projects && Array.isArray(app.projects) && app.projects.some(proj => proj.projectName || proj.repoUrl) ? (
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

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-white/[0.05] font-sans">
                      {filteredApps.map((app) => (
                        <div key={app._id} className="p-4 space-y-3">
                          {/* Top Row: Name & Role Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link to={`/admin/users/${app.userId?._id || app.userId}`} className="font-semibold text-white hover:text-indigo-400 hover:underline transition text-base">
                                {app.name}
                              </Link>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{app.email}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border shrink-0 ${app.roleId === "contributor"
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
                          </div>

                          {/* Details Box */}
                          <div className="space-y-1.5 text-xs bg-slate-950/40 p-3 rounded-xl border border-white/5">
                            {app.phone && (
                              <div>
                                <span className="text-slate-500 font-mono">Mobile Number:</span>{" "}
                                <span className="text-slate-300 font-medium">{app.phone}</span>
                              </div>
                            )}
                            {app.github && (
                              <div>
                                <span className="text-slate-500 font-mono">GitHub:</span>{" "}
                                <a href={app.github.startsWith("http") ? app.github : `https://github.com/${app.github}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                  {app.github}
                                </a>
                              </div>
                            )}
                            {app.linkedin && (
                              <div>
                                <span className="text-slate-500 font-mono">LinkedIn:</span>{" "}
                                <a href={app.linkedin.startsWith("http") ? app.linkedin : `https://linkedin.com/in/${app.linkedin}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                  {app.linkedin}
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
                            {app.projects && Array.isArray(app.projects) && app.projects.some(proj => proj.projectName || proj.repoUrl) ? (
                              <div className="mt-2 space-y-1 border-l-2 border-purple-500/30 pl-2">
                                <div className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">Submitted Projects:</div>
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
                                    <span className="text-slate-500 font-mono">Project:</span> {app.projectName}
                                  </div>
                                )}
                                {app.repoUrl && (
                                  <div>
                                    <span className="text-slate-500 font-mono">Repo:</span>{" "}
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
                              <div className="mt-1.5 p-2 bg-slate-950/60 rounded border border-white/5 italic text-slate-400 max-h-24 overflow-y-auto">
                                "{app.motivation}"
                              </div>
                            )}
                            {app.message && (
                              <div className="mt-1.5 p-2 bg-slate-950/60 rounded border border-white/5 italic text-slate-400 max-h-24 overflow-y-auto">
                                "{app.message}"
                              </div>
                            )}
                          </div>

                          {/* Status & Actions Footer */}
                          <div className="flex items-center justify-between pt-1 gap-2">
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

                            {app.status === "pending" ? (
                              <div className="flex items-center gap-2">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Load More Applications */}
              {hasMoreApps && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMoreApps}
                    disabled={loadingMoreApps}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {loadingMoreApps ? "Loading Applications..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* VIEW 2: Projects Management Section */}
          {section === "projects" && (
            <>
              {/* Header Button & Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <span className="text-slate-400 text-xs sm:text-sm font-medium">
                  Currently sync-monitoring {projects.length} repository projects
                </span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer w-full sm:w-auto"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>

              {/* Projects List Container */}
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
                  <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.05] text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/20">
                            <th className="py-4 px-6">Project Title</th>
                            <th className="py-4 px-6">Track & Tags</th>
                            <th className="py-4 px-6">Stats (Live)</th>
                            <th className="py-4 px-6">Assigned Project Admin</th>
                            <th className="py-4 px-6">Repository URL</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
                          {filteredProjectsList.map((project) => (
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
                              <td className="py-5 px-6">
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono hover:underline cursor-pointer"
                                >
                                  {project.githubOwner}/{project.githubRepo} <ExternalLink size={12} />
                                </a>
                              </td>

                              {/* Actions / Toggle Active */}
                              <td className="py-5 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleToggleProjectActive(project.id)}
                                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                      project.isActive !== false
                                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                                    title={project.isActive !== false ? "Hide Project" : "Show Project"}
                                  >
                                    {project.isActive !== false ? (
                                      <>
                                        <Check size={14} /> Active
                                      </>
                                    ) : (
                                      <>
                                        <X size={14} /> Hidden
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleEditProjectClick(project)}
                                    className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition cursor-pointer"
                                    title="Edit Project"
                                  >
                                    <Edit size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-white/[0.05] font-sans">
                      {filteredProjectsList.map((project) => (
                        <div key={project.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-white text-base">{project.title}</div>
                              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5 mt-1 inline-block font-mono">
                                {project.date}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border shrink-0 bg-${project.color}-500/10 text-${project.color}-300 border-${project.color}-500/20`}>
                              {project.tag}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-xl border border-white/5 font-mono">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-yellow-500/80">
                                <Star size={12} /> {project.stars}
                              </span>
                              <span className="flex items-center gap-1 text-blue-400/80">
                                <GitFork size={12} /> {project.forks}
                              </span>
                            </div>
                            <span className="text-purple-300 font-bold">+{project.points} PTS</span>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <div>
                              <span className="text-slate-500 text-[10px] block font-mono">ASSIGNED ADMIN</span>
                              {project.projectAdmin ? (
                                <span className="font-medium text-slate-200">{project.projectAdmin.name}</span>
                              ) : (
                                <span className="text-slate-500 italic">Unassigned</span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono hover:underline cursor-pointer"
                              >
                                {project.githubOwner}/{project.githubRepo} <ExternalLink size={12} />
                              </a>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleProjectActive(project.id)}
                                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    project.isActive !== false
                                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                  }`}
                                  title={project.isActive !== false ? "Hide Project" : "Show Project"}
                                >
                                  {project.isActive !== false ? (
                                    <>
                                      <Check size={14} /> Active
                                    </>
                                  ) : (
                                    <>
                                      <X size={14} /> Hidden
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleEditProjectClick(project)}
                                  className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* VIEW 3: Support Tickets Section */}
          {section === "support" && (
            <>
              {/* Toolbar & Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <span className="text-slate-400 text-xs sm:text-sm font-medium">
                  Currently managing {tickets.length} support requests
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 no-scrollbar whitespace-nowrap">
                  {["all", "open", "in-progress", "resolved"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTicketFilter(tab)}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer shrink-0 ${ticketFilter === tab
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
                  <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto font-sans">
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
                          {filteredTicketsList.map((ticket) => (
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
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border tracking-wider ${ticket.status === "resolved"
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

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-white/[0.05] font-sans">
                      {filteredTicketsList.map((ticket) => (
                        <div key={ticket._id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-white text-base">{ticket.name}</div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{ticket.email}</div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border tracking-wider shrink-0 ${ticket.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : ticket.status === "in-progress"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                            >
                              {ticket.status}
                            </span>
                          </div>

                          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-1.5">
                            <div className="text-xs font-semibold text-slate-200">{ticket.subject}</div>
                            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-light">
                              {ticket.message}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>

                            <select
                              disabled={updatingTicket[ticket._id]}
                              value={ticket.status}
                              onChange={(e) => handleUpdateTicketStatus(ticket._id, e.target.value)}
                              className="bg-slate-950 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="open">Status: Open</option>
                              <option value="in-progress">Status: In-Progress</option>
                              <option value="resolved">Status: Resolved</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* VIEW 4: Award Points Section */}
          {section === "points" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Star className="text-indigo-400" size={20} /> Leaderboard Points Administration
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manually award points to verified Ambassadors and Contributors (e.g., for sharing badges on LinkedIn).
                  </p>
                </div>
              </div>

              {/* Table of Approved Users */}
              <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl relative">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                {fetchingUsers ? (
                  <div className="py-20 text-center">
                    <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading eligible users...</p>
                  </div>
                ) : approvedUsers.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    <Users className="mx-auto mb-4 opacity-30" size={48} />
                    <p className="text-lg font-semibold">No Approved Users Found</p>
                    <p className="text-sm mt-1">There are no approved ambassadors or contributors in the system yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto font-sans">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.05] text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/20">
                            <th className="py-4 px-6">User Details</th>
                            <th className="py-4 px-6">Role Tracks</th>
                            <th className="py-4 px-6">Current Points</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
                          {filteredUsersList.map((usr) => (
                            <tr key={usr._id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-4 px-6">
                               <Link to={`/admin/users/${usr._id}`} className="font-semibold text-white hover:text-indigo-400 hover:underline transition">
                                  {usr.name}
                                </Link>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">{usr.email}</div>
                                {usr.referralCode && (
                                  <div className="text-[10px] text-teal-400 font-mono mt-1">
                                    Ref Code: {usr.referralCode}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-wrap gap-1">
                                  {(usr.roles && usr.roles.length > 0 ? usr.roles : [usr.role]).filter(Boolean).map((r, rIdx) => (
                                    <span
                                      key={rIdx}
                                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase border ${r === "ambassador"
                                        ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                        : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                        }`}
                                    >
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-white text-base">
                                {usr.points || 0} pts
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setSelectedUserForPoints(usr)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 ml-auto cursor-pointer"
                                >
                                  <Star size={12} fill="white" /> Award Points
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-white/[0.05] font-sans">
                      {filteredUsersList.map((usr) => (
                        <div key={usr._id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link to={`/admin/users/${usr._id}`} className="font-semibold text-white hover:text-indigo-400 hover:underline transition text-base">
                                {usr.name}
                              </Link>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{usr.email}</div>
                              {usr.referralCode && (
                                <div className="text-[10px] text-teal-400 font-mono mt-1">
                                  Ref Code: {usr.referralCode}
                                </div>
                              )}
                            </div>
                            <div className="font-mono font-bold text-white text-xs sm:text-sm bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg shrink-0">
                              {usr.points || 0} pts
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 gap-2">
                            <div className="flex flex-wrap gap-1">
                              {(usr.roles && usr.roles.length > 0 ? usr.roles : [usr.role]).filter(Boolean).map((r, rIdx) => (
                                <span
                                  key={rIdx}
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase border ${r === "ambassador"
                                    ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                    : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                    }`}
                                >
                                  {r}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => setSelectedUserForPoints(usr)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Star size={12} fill="white" /> Award Points
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Load More Approved Users */}
              {hasMoreUsers && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMoreUsers}
                    disabled={loadingMoreUsers}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider font-mono transition shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {loadingMoreUsers ? "Loading Eligible Users..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Award Points Modal */}
          {selectedUserForPoints && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-md p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Award Points to {selectedUserForPoints.name}
                </h3>
                <p className="text-slate-400 text-xs mb-6 border-b border-white/[0.05] pb-4">
                  Award manual leaderboard points after verifying their social media sharing (e.g. LinkedIn).
                </p>

                {pointsError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {pointsError}
                  </div>
                )}

                <form onSubmit={handleAwardPoints} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Points to Award</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                      value={pointsAwardForm.points}
                      onChange={(e) => setPointsAwardForm(prev => ({ ...prev, points: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Reason / Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="E.g., Verified LinkedIn post tagging Altraverse with certificate badge"
                      className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none transition resize-none"
                      value={pointsAwardForm.reason}
                      onChange={(e) => setPointsAwardForm(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>

                  <div className="mt-8 border-t border-white/[0.05] pt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserForPoints(null);
                        setPointsError("");
                      }}
                      className="px-5 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingPoints}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition duration-250 disabled:opacity-50 cursor-pointer"
                    >
                      {submittingPoints ? "Awarding..." : "Confirm & Award"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Webhook Configuration Details Modal (Success State) */}
          {webhookConfig && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-lg p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-t-3xl" />

                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={24} /> Project Added Successfully!
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
                        className="flex-grow bg-transparent text-xs text-slate-300 font-mono px-3 focus:outline-none min-w-0"
                      />
                      <button
                        onClick={() => handleCopy(webhookConfig.payloadUrl, "url")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
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
                        className="flex-grow bg-transparent text-xs text-slate-300 font-mono px-3 focus:outline-none min-w-0"
                      />
                      <button
                        onClick={() => handleCopy(webhookConfig.secret, "secret")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedText === "secret" ? <Check size={14} /> : <Copy size={14} />} Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/[0.05] pt-5 flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-slate-400 shrink-0">
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
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-2xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
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
                        {projectAdmins.map((adm) => {
                          let indicator = "";
                          if (adm.application) {
                            if (adm.application.liveStatus === "all-live") indicator = " ✅ Live";
                            else if (adm.application.liveStatus === "partial-live") indicator = " 🟠 Partial";
                          }
                          return (
                            <option key={adm._id} value={adm._id}>
                              {adm.name} (@{adm.githubUsername || adm.email.split("@")[0]}){indicator}
                            </option>
                          );
                        })}
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
                            {proj.projectName} ({proj.repoUrl}){proj.isLive ? " ✅ Live" : ""}
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-400">Card Image URL (optional)</label>
                        <label className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer bg-indigo-500/10 px-2 py-0.5 rounded transition">
                          Upload File
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                        </label>
                      </div>
                      <input
                        type="text"
                        name="image"
                        placeholder="https://images.unsplash.com/... or upload"
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

          {/* Edit Project Form Modal */}
          {showEditModal && editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-[#0c102b] border border-white/[0.08] rounded-3xl w-full max-w-2xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Edit Project Details
                </h3>
                <p className="text-slate-400 text-xs mb-6 border-b border-white/[0.05] pb-4">
                  Update the project configuration. (GitHub connection URL is locked to preserve webhook).
                </p>

                <form onSubmit={handleUpdateProject} className="space-y-4">
                  {/* Row 1: Title and Tag */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Project Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Track / Tag Category</label>
                      <select
                        name="tag"
                        required
                        value={editingProject.tag}
                        onChange={(e) => setEditingProject({ ...editingProject, tag: e.target.value })}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      >
                        <option value="Fullstack">Fullstack Development</option>
                        <option value="Frontend">Frontend / UI</option>
                        <option value="Backend">Backend / API</option>
                        <option value="AI/ML">Artificial Intelligence</option>
                        <option value="Web3">Web3 / Blockchain</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Theme Color and Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Card Theme Color</label>
                      <select
                        name="color"
                        value={editingProject.color}
                        onChange={(e) => setEditingProject({ ...editingProject, color: e.target.value })}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      >
                        <option value="violet">Violet Theme</option>
                        <option value="emerald">Emerald Theme</option>
                        <option value="cyan">Cyan Theme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Max Reward Points</label>
                      <input
                        type="number"
                        name="points"
                        required
                        min="0"
                        value={editingProject.points}
                        onChange={(e) => setEditingProject({ ...editingProject, points: Number(e.target.value) })}
                        className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Row 3: Image URL */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-400">Card Image URL</label>
                      <label className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer bg-indigo-500/10 px-2 py-0.5 rounded transition">
                        Upload File
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                      </label>
                    </div>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://images.unsplash.com/... or upload"
                      value={editingProject.image || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                    />
                  </div>

                  {/* Description Box */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Brief Description</label>
                    <textarea
                      name="description"
                      required
                      rows="3"
                      value={editingProject.description || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/5 hover:border-white/15 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none transition"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="mt-8 border-t border-white/[0.05] pt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-5 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingProject}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition duration-250 disabled:opacity-50 cursor-pointer"
                    >
                      {submittingProject ? "Saving..." : "Save Changes"}
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


