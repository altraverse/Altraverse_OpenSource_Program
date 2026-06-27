import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Ensure lucide-react is installed

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/announcement", label: "Announcements" },
    { to: "/resources", label: "Resources" },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-40 w-full">
      <nav className="mx-auto flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#0b0128]/40 px-5 py-4 backdrop-blur-xl">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <h3 className="text-xl font-bold text-white">
            <Link to="/">ASOC</Link>
          </h3>


        </div>

        {/* Desktop Navigation */}
        <div className="desk items-center gap-5 text-sm text-gray-400">
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
          <div className="desk items-center gap-3">
            <Link
              to='/become-mentor'
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-gray-300 hover:text-white hover:border-white transition-colors"
            >
              Become a Mentor
            </Link>
            <Link
              to='/login'
              className="rounded-full border border-white px-5 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
            <Link
              to='/resources'
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-[#0b0128]/95 border border-white/10 rounded-2xl px-6 py-4 flex flex-col gap-4 text-center backdrop-blur-xl">
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
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                navigate('/become-mentor');
              }}
              className="w-full hover:bg-white/10 rounded-full border border-white/20 text-gray-300 hover:text-white"
            >
              Become a Mentor
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full hover:bg-white/10 rounded-full border border-white text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate('/resources');
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
