import { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, UserX, Clock, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});

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

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchApplications();
    }
  }, [user]);

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
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-white">
        <h2 className="text-xl font-semibold">Loading...</h2>
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

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                Admin Panel <ShieldCheck className="text-indigo-400" size={28} />
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage, review, and approve cohort track role applications.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
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
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected", "contributor", "ambassador", "project-admin", "sponsor", "mentor"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    filter === tab
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                      : "border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-white/15"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Grid/Table Area */}
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
              <div className="overflow-x-auto">
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
                            {new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
