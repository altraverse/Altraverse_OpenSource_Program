import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/announcement", label: "Announcements" },
    { to: "/partners", label: "Partners" },
    { to: "/resources", label: "Resources" },
  ];

  const getDisplayRole = (u) => {
    if (!u) return "";
    if (u.role === "admin" || (u.roles && u.roles.includes("admin"))) return "admin";
    const activeRoles = (u.roles || [u.role]).filter(r => r !== "user");
    if (activeRoles.length === 0) return "user";
    if (activeRoles.length === 1) return activeRoles[0];
    const formatted = activeRoles.map(r => r.replace("-", " ")).join(", ");
    if (formatted.length > 20) {
      return "Super Member";
    }
    return formatted;
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 lg:px-24 xl:px-40 w-full">
      <nav
        style={{ transform: "translate3d(0, 0, 0)", WebkitTransform: "translate3d(0, 0, 0)", WebkitBackdropFilter: "blur(24px)" }}
        className="mx-auto flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#06091b]/70 px-5 py-3.5 backdrop-blur-xl transition-all shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
      >
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="ASOC Logo"
              className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-lg font-bold text-white tracking-wider group-hover:text-violet-400 transition-colors duration-200">
              ASOC
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer rounded-full ${isActive ? "text-violet-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-[0_0_8px_#8b5cf6]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Desktop Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all uppercase tracking-wider font-mono mr-1"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Clickable Account Badge linking to profile */}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-full pl-3.5 pr-2.5 py-1.5 text-xs text-white transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span className="font-semibold text-white/90">{user.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold font-mono uppercase tracking-wider ${user.role === "admin" || (user.roles && user.roles.includes("admin"))
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : user.roles && user.roles.filter(r => r !== "user").length > 1
                        ? "bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                        : user.role === "contributor"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : user.role === "ambassador"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : user.role === "project-admin"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : user.role === "sponsor"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : user.role === "mentor"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                      }`}
                  >
                    {getDisplayRole(user)}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-600 hover:border-red-500 px-4 py-2 text-xs font-semibold text-red-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut size={12} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/become-mentor"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/[0.02] transition-colors"
                >
                  Become a Mentor
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 hover:border-white/30 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2 text-xs font-bold text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ transform: "translate3d(0, 0, 0)", WebkitTransform: "translate3d(0, 0, 0)", WebkitBackdropFilter: "blur(4px)" }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Side-Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ transform: "translate3d(0, 0, 0)", WebkitTransform: "translate3d(0, 0, 0)", WebkitBackdropFilter: "blur(40px)" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[320px] bg-[#06091b]/95 border-l border-white/10 p-6 flex flex-col justify-between backdrop-blur-2xl overflow-y-auto [-webkit-overflow-scrolling:touch] shadow-[[-10px_0_30px_rgba(0,0,0,0.5)]] lg:hidden"
            >
              {/* Top Section: Header */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <img src={logo} alt="ASOC Logo" className="h-8 w-8 object-contain" />
                    <span className="text-lg font-bold text-white tracking-wide">ASOC</span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-1.5">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                          ? "bg-violet-600/10 border border-violet-500/20 text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                          }`}
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowRight size={14} className={`transition-transform duration-200 ${isActive ? "text-violet-400" : "text-gray-600 group-hover:translate-x-1"}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Middle Section: Profile & Actions */}
              <div className="flex flex-col gap-4 my-auto pt-6 pb-6">
                {user ? (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                        {user.name ? user.name[0].toUpperCase() : <User size={16} />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-white truncate max-w-[170px]">{user.name}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-[170px]">{user.email || "Contributor"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(user.roles && user.roles.length > 0 ? user.roles : [user.role || "user"]).map((r) => (
                        <span
                          key={r}
                          className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold font-mono uppercase tracking-wider border ${r === "admin"
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
                          {r.replace("-", " ")}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs font-semibold text-white transition-colors"
                      >
                        <User size={13} /> Profile Settings
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-semibold text-indigo-300 transition-colors"
                        >
                          <Shield size={13} /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 transition-colors"
                      >
                        <LogOut size={13} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/resources"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:opacity-95 transition-all"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/become-mentor"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                    >
                      Become a Mentor
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Section: Community & Socials */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10 text-left">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 px-1">
                  Join the Network
                </span>
                <a
                  href="https://chat.whatsapp.com/K9YQAz1PxAyDnB2Kw4lteJ?s=cl&p=a&mlu=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-xs font-semibold text-[#25D366] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.479 1.332 5.006l-1.354 4.954 5.074-1.331c1.472.802 3.125 1.223 4.819 1.225h.004c5.505 0 9.987-4.482 9.987-9.988 0-2.668-1.039-5.176-2.927-7.065-1.888-1.887-4.397-2.926-7.065-2.926zm5.823 13.064c-.242.684-1.201 1.25-1.656 1.298-.444.047-.872.247-2.884-.551-2.011-.798-3.303-2.842-3.403-2.975-.1-.134-.814-1.084-.814-2.068 0-.983.513-1.467.697-1.668.184-.2.4-.25.534-.25h.384c.125 0 .292-.047.459.359.167.406.571 1.391.621 1.492.05.101.083.219.017.352-.067.133-.1.219-.2.336-.1.117-.21.261-.3.35-.1.101-.205.21-.089.41.117.2.52 1.012.92 1.368.513.456.953.597 1.087.664.134.067.21.05.292-.046.082-.097.352-.41.444-.551.092-.142.184-.117.31-.071l1.272.597c.125.067.208.101.242.158.033.058.033.336-.075.687z" />
                  </svg>
                  WhatsApp Community
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}



