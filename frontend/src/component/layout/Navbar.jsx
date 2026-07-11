import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/announcement", label: "Announcements" },
    { to: "/resources", label: "Resources" },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 lg:px-24 xl:px-40 w-full">
      <nav className="mx-auto flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#0b0128]/40 px-5 py-4 backdrop-blur-xl">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-1 group">
            <img
              src={logo}
              alt="ASOC Logo"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-bold text-white tracking-wide group-hover:text-indigo-400 transition-colors duration-200">
              ASOC
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5 text-sm text-gray-400">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="cursor-pointer hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
                    className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors uppercase tracking-wider font-mono mr-2"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Clickable Account Badge linking to profile */}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-full pl-3.5 pr-2.5 py-1.5 text-sm text-white transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span className="font-semibold text-white/95">{user.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase tracking-wider ${user.role === "admin"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
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
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-full border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-red-300 hover:text-white transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/become-mentor"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-gray-300 hover:text-white hover:border-white transition-colors"
                >
                  Become a Mentor
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white px-5 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/resources"
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden mt-2 bg-[#0b0128]/95 border border-white/10 rounded-2xl px-6 py-4 flex flex-col gap-4 text-center backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-base py-2 border-b border-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Action Buttons inside the mobile menu */}
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-full font-semibold"
                  >
                    ADMIN DASHBOARD
                  </Button>
                )}

                {/* Clickable Profile Detail Box linking to profile */}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-3 flex flex-col items-center cursor-pointer transition-colors"
                >
                  <span className="text-sm font-semibold text-white/95">{user.name}</span>
                  <span
                    className={`mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase tracking-wider inline-block ${user.role === "admin"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
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
                    {user.role}
                  </span>
                </Link>

                <Button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 rounded-full font-semibold text-white mt-1"
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/become-mentor");
                  }}
                  className="w-full hover:bg-white/10 rounded-full border border-white/20 text-gray-300 hover:text-white"
                >
                  Become a Mentor
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full hover:bg-white/10 rounded-full border border-white text-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/resources");
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
