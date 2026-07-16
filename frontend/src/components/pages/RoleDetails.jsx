import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Code2, 
  Megaphone, 
  Terminal, 
  Handshake, 
  Check, 
  Send,
  User,
  Mail,
  GitBranch,
  Building,
  GraduationCap,
  MessageSquare,
  Globe
} from "lucide-react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";

// Metadata map for each of the 4 roles
const roleMetadata = {
  contributor: {
    id: "contributor",
    title: "Contributor",
    badge: "Core Participant",
    icon: Code2,
    color: "blue",
    glow: "rgba(59, 130, 246, 0.15)",
    textClass: "text-blue-400",
    pillClass: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
    buttonStyle: "bg-blue-600 hover:bg-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)]",
    tagline: "Start solving issues, merging code, and building your global profile.",
    responsibilities: [
      "Find, claim, and solve open GitHub issues",
      "Submit high-quality pull requests",
      "Collaborate with repository maintainers and mentors",
      "Write documentation, tutorials, or unit tests"
    ],
    benefits: [
      "Official certificate of program participation",
      "Exclusive swag (stickers, t-shirts, badges)",
      "1-on-1 mentorship from top open-source devs",
      "Climb the global ASOC leaderboard"
    ]
  },
  ambassador: {
    id: "ambassador",
    title: "Ambassador",
    badge: "Community Advocate",
    icon: Megaphone,
    color: "rose",
    glow: "rgba(244, 63, 94, 0.15)",
    textClass: "text-rose-400",
    pillClass: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    buttonStyle: "bg-rose-600 hover:bg-rose-500 shadow-[0_4px_20px_rgba(244,63,94,0.3)]",
    tagline: "Promote open-source culture on your campus and grow your local network.",
    responsibilities: [
      "Host local meetups, workshops, and hackathons",
      "Spread awareness of ASOC across college campuses",
      "Help onboard new contributors to the platform",
      "Publish student spotlight stories and social posts"
    ],
    benefits: [
      "Exclusive Campus Ambassador swags and kits",
      "Direct recommendation letters from program directors",
      "Build leadership, networking, and public speaking skills",
      "Fast-tracked application review for next cohorts"
    ]
  },
  "project-admin": {
    id: "project-admin",
    title: "Project Admin",
    badge: "Repository Owner",
    icon: Terminal,
    color: "purple",
    glow: "rgba(168, 85, 247, 0.15)",
    textClass: "text-purple-400",
    pillClass: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
    buttonStyle: "bg-purple-600 hover:bg-purple-500 shadow-[0_4px_20px_rgba(168,85,247,0.3)]",
    tagline: "Scale your open-source projects with high-quality global contributions.",
    responsibilities: [
      "Submit your project codebase with setup instructions",
      "Curate, tag, and organize beginner-friendly issues",
      "Review pull requests and merge quality contributions",
      "Mentor students in codebase architecture"
    ],
    benefits: [
      "Accelerate features, bug fixes, and development cycles",
      "Source and scout top developer talent directly",
      "Increase project stars, forks, and global visibility",
      "Special program recognition and maintainer rewards"
    ]
  },
  sponsor: {
    id: "sponsor",
    title: "Partner / Sponsor",
    badge: "Strategic Partner",
    icon: Handshake,
    color: "amber",
    glow: "rgba(245, 158, 11, 0.15)",
    textClass: "text-amber-400",
    pillClass: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    buttonStyle: "bg-amber-600 hover:bg-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.3)]",
    tagline: "Empower developer growth and build connections with technical talent.",
    responsibilities: [
      "Fund program rewards, swags, and prizes",
      "Provide cloud resources, sandbox credits, or tool licenses",
      "Propose customized track challenges for contributors",
      "Offer internship opportunities or technical mentorship"
    ],
    benefits: [
      "Prominent company logo placement and branding",
      "Access to top-performing contributor resumes",
      "Co-host webinars, technical workshops, and talks",
      "Strengthen community developer relations"
    ]
  }
};

export default function RoleDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const role = roleMetadata[roleId];

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    college: "",
    year: "1st Year",
    techStack: "",
    projectName: "",
    repoUrl: "",
    company: "",
    tier: "Bronze Tier",
    motivation: "",
    message: "",
    projects: [{ projectName: "", repoUrl: "" }]
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user } = useAuth();
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: prev.name || user.name || "",
      }));

      const checkSubmissions = async () => {
        try {
          const res = await API.get("/api/roles/my-applications");
          if (res.data.success && res.data.applications) {
            const found = res.data.applications.find(app => 
              app.roleId === roleId && (roleId === "project-admin" ? app.status === "pending" : true)
            );
            if (found) {
              setExistingApplication(found);
            }
          }
        } catch (error) {
          console.error("Failed to fetch applications status", error);
        } finally {
          setCheckingStatus(false);
        }
      };

      checkSubmissions();
    } else {
      setCheckingStatus(false);
    }
  }, [user, roleId]);

  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06091b] text-white">
        <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!role) {
    return (
      <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-24">
          <h2 className="text-2xl font-bold text-white mb-2">Role Page Not Found</h2>
          <p className="text-white/40 mb-6 font-light">The role track you are seeking does not exist.</p>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm text-gray-300 hover:text-white hover:border-white transition-all"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = role.icon;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  };

  const addProjectField = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { projectName: "", repoUrl: "" }]
    }));
  };

  const removeProjectField = (index) => {
    setFormData((prev) => {
      const updatedProjects = prev.projects.filter((_, i) => i !== index);
      return { ...prev, projects: updatedProjects.length === 0 ? [{ projectName: "", repoUrl: "" }] : updatedProjects };
    });
  };

  const handleGuestInteraction = (e) => {
    if (!user) {
      e.stopPropagation();
      e.preventDefault();
      alert("You must create an account or log in to apply for a role. Redirecting to register page...");
      navigate("/register");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must create an account or log in to apply for a role. Redirecting to register page...");
      navigate("/register");
      return;
    }
    setLoading(true);
    setSubmitError("");

    try {
      const response = await API.post("/api/roles/apply", {
        roleId: role.id,
        ...formData
      });
      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setSubmitError("You must be logged in to register for a role. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSubmitError(
          err.response?.data?.message || "Failed to submit your application. Please check your network and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Render role-specific forms
  const renderForm = () => {
    switch (role.id) {
      case "contributor":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    readOnly
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email address"
                    className="w-full bg-[#0c102b]/60 border border-white/[0.05] rounded-xl py-3 pl-10 pr-4 text-sm text-white/40 outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">GitHub Username / Profile URL</label>
              <div className="relative">
                <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  required
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="github.com/username"
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Preferred Tech Stack (Comma Separated)</label>
              <div className="relative">
                <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  required
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="React, TypeScript, Go, Rust..."
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                />
              </div>
            </div>
          </>
        );
      case "ambassador":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-rose-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    readOnly
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email address"
                    className="w-full bg-[#0c102b]/60 border border-white/[0.05] rounded-xl py-3 pl-10 pr-4 text-sm text-white/40 outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2 flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">College / University Name</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="E.g., IIT Bombay"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-rose-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-rose-500/50 rounded-xl py-3 px-4 text-sm text-white/90 outline-none transition-all"
                >
                  <option className="bg-[#06091b]" value="1st Year">1st Year</option>
                  <option className="bg-[#06091b]" value="2nd Year">2nd Year</option>
                  <option className="bg-[#06091b]" value="3rd Year">3rd Year</option>
                  <option className="bg-[#06091b]" value="4th Year">4th Year</option>
                  <option className="bg-[#06091b]" value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">GitHub Username</label>
              <div className="relative">
                <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  required
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="github.com/username"
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-rose-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Why do you want to represent ASOC? (Short Answer)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 text-white/30" size={16} />
                <textarea
                  required
                  rows="3"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Tell us why you would be a great fit to advocate for open-source on your campus."
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-rose-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white/90 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </>
        );
      case "project-admin":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Project Admin Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Admin Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    readOnly
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email address"
                    className="w-full bg-[#0c102b]/60 border border-white/[0.05] rounded-xl py-3 pl-10 pr-4 text-sm text-white/40 outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 border-b border-white/5 pb-4">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
                <span>Projects List</span>
                <button
                  type="button"
                  onClick={addProjectField}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-semibold text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  + Add More Project
                </button>
              </h4>
              
              {formData.projects.map((project, idx) => (
                <div key={idx} className="relative p-4 rounded-xl border border-white/[0.05] bg-[#0c102b]/20 mb-4">
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProjectField(idx)}
                      className="absolute right-3 top-3 text-red-400/60 hover:text-red-400 text-xs transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Project Name {idx + 1}</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                          required
                          type="text"
                          value={project.projectName}
                          onChange={(e) => handleProjectChange(idx, "projectName", e.target.value)}
                          placeholder="E.g., TARS Web Core"
                          className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Repository Link {idx + 1}</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                          required
                          type="url"
                          value={project.repoUrl}
                          onChange={(e) => handleProjectChange(idx, "repoUrl", e.target.value)}
                          placeholder="https://github.com/org/repo"
                          className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Primary Tech Stack</label>
              <div className="relative">
                <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  required
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="E.g. Go, Rust, Next.js"
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Brief Project Description</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 text-white/30" size={16} />
                <textarea
                  required
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your project, open-source scope, and what kind of issues contributors will solve."
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-purple-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white/90 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </>
        );
      case "sponsor":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-amber-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Business Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    readOnly
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="E.g., sponsor@company.com"
                    className="w-full bg-[#0c102b]/60 border border-white/[0.05] rounded-xl py-3 pl-10 pr-4 text-sm text-white/40 outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Company / Org Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    required
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-amber-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white/90 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Sponsorship Level Interest</label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-amber-500/50 rounded-xl py-3 px-4 text-sm text-white/90 outline-none transition-all"
                >
                  <option className="bg-[#06091b]" value="Bronze Tier">Bronze Tier ($500)</option>
                  <option className="bg-[#06091b]" value="Silver Tier">Silver Tier ($1,500)</option>
                  <option className="bg-[#06091b]" value="Gold Tier">Gold Tier ($3,000)</option>
                  <option className="bg-[#06091b]" value="Platinum Tier">Platinum Tier ($5,000+)</option>
                  <option className="bg-[#06091b]" value="Custom Track Support">Custom Track Support</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs text-white/50 mb-2 font-mono uppercase tracking-wider">Message / Details (Optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 text-white/30" size={16} />
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Provide details about your support scope, resources, or general queries."
                  className="w-full bg-[#0c102b]/40 border border-white/[0.08] hover:border-white/15 focus:border-amber-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white/90 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }} className="relative overflow-hidden font-body flex flex-col justify-between">
      {/* Background Starfield and Orb */}
      <div className="absolute inset-0 starfield pointer-events-none opacity-40" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(ellipse at 50% 0%, ${role.glow} 0%, transparent 70%)` 
        }} 
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full flex-grow flex flex-col justify-center">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            BACK TO HOME
          </Link>
        </div>

        {/* Roles Details Splitting Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Column: Role Information (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${role.pillClass}`}>
                  {role.badge}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                {role.title} Track
              </h1>

              <p className="text-white/50 text-[14px] leading-relaxed font-light mb-4">
                {role.tagline}
              </p>
            </div>

            <hr className="border-white/[0.05]" />

            {/* Key Responsibilities */}
            <div>
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-3.5 font-mono">Responsibilities</h3>
              <ul className="space-y-3">
                {role.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start text-xs text-white/40 leading-relaxed">
                    <span className={`h-1.5 w-1.5 rounded-full mt-1.5 mr-3 flex-shrink-0 bg-indigo-500`} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/[0.05]" />

            {/* Perks & Benefits */}
            <div>
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-3.5 font-mono">Perks & Benefits</h3>
              <ul className="space-y-3">
                {role.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-xs text-white/40 leading-relaxed">
                    <Check size={14} className="text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Form Card (7 columns) */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-[#0c102b]/40 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
              
              {/* Form card background glow */}
              <div 
                className="absolute -bottom-10 -left-10 w-44 h-44 opacity-25 pointer-events-none blur-3xl rounded-full"
                style={{ backgroundColor: role.color === "rose" ? "#ec4899" : role.color === "purple" ? "#a855f7" : role.color === "amber" ? "#f59e0b" : "#3b82f6" }}
              />

              <AnimatePresence mode="wait">
                {existingApplication ? (
                  <motion.div
                    key="existing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-6 text-center flex flex-col items-center justify-center text-white"
                  >
                    <div className="flex items-center gap-3.5 mb-6 w-full text-left">
                      <div className={`w-11 h-11 rounded-xl border ${role.pillClass} flex items-center justify-center`}>
                        <Icon size={20} className={role.textClass} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Application Received</h2>
                        <p className="text-xs text-white/35 font-light">You have already registered for this track.</p>
                      </div>
                    </div>

                    <div className="w-full bg-[#06091b]/50 border border-white/[0.05] rounded-2xl p-6 text-left mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                        <span className="text-xs text-slate-400 font-mono">Current Status:</span>
                        <div className="flex items-center gap-1.5">
                          {existingApplication.status === "approved" ? (
                            <>
                              <Check size={16} className="text-emerald-400" />
                              <span className="font-semibold text-emerald-400 text-xs font-mono">Approved</span>
                            </>
                          ) : existingApplication.status === "rejected" ? (
                            <>
                              <X size={16} className="text-red-400" />
                              <span className="font-semibold text-red-400 text-xs font-mono">Rejected</span>
                            </>
                          ) : (
                            <>
                              <Clock size={16} className="text-amber-400 animate-pulse" />
                              <span className="font-semibold text-amber-400 text-xs font-mono">Pending Review</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 font-mono">Applicant Name:</span> {existingApplication.name}
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono">Registered Email:</span> {existingApplication.email}
                        </div>
                        {existingApplication.github && (
                          <div>
                            <span className="text-slate-500 font-mono">GitHub Profile:</span> {existingApplication.github}
                          </div>
                        )}
                        {existingApplication.college && (
                          <div>
                            <span className="text-slate-500 font-mono">College:</span> {existingApplication.college} ({existingApplication.year})
                          </div>
                        )}
                        {existingApplication.techStack && (
                          <div>
                            <span className="text-slate-500 font-mono">Tech Stack:</span> {existingApplication.techStack}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        to="/roles"
                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold text-gray-300 hover:text-white transition-all font-mono"
                      >
                        BACK TO ROLES
                      </Link>
                      {existingApplication.status === "approved" && role.id === "contributor" && (
                        <Link
                          to="/projects"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 shadow-lg shadow-blue-500/20 transition-all font-mono"
                        >
                          EXPLORE PROJECTS
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ) : !isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className={`w-11 h-11 rounded-xl border ${role.pillClass} flex items-center justify-center`}>
                        <Icon size={20} className={role.textClass} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Apply For Role</h2>
                        <p className="text-xs text-white/35 font-light">Fill out details below and join our ASOC cohort.</p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-normal">
                        {submitError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} onClickCapture={handleGuestInteraction}>
                      {renderForm()}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-center text-white cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${role.buttonStyle} disabled:opacity-50`}
                      >
                        {loading ? (
                          <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Submit Registration <Send size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                    className="py-12 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                      <Check size={32} className="text-emerald-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
                    <p className="text-white/50 text-sm leading-relaxed max-w-md font-light mb-8">
                      Thank you, <strong className="text-white/80 font-semibold">{formData.name}</strong>. 
                      Your application as a <strong className={role.textClass}>{role.title}</strong> has been received successfully.
                      We will review details and get back to you at <span className="text-white/70 font-mono text-xs">{formData.email}</span> shortly.
                    </p>

                    <div className="flex gap-4">
                      <Link
                        to="/"
                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold text-gray-300 hover:text-white transition-all font-mono"
                      >
                        BACK TO HOME
                      </Link>
                      {role.id === "contributor" && (
                        <Link
                          to="/projects"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white hover:opacity-90 shadow-lg shadow-blue-500/20 transition-all font-mono"
                        >
                          EXPLORE PROJECTS
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
