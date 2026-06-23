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
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-16 py-4 md:py-6">

        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <h2 className="font-black text-2xl tracking-tighter">
            <Link to="/">ASOC</Link>
          </h2>

          {/* Desktop Navigation - Switched from lg:flex to md:flex so it shows on laptops */}
          <div className="desk items-center gap-6 text-sm text-white font-medium opacity-80">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:opacity-100 transition-opacity text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Desktop Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3">

          {/* Desktop Buttons - Shows on tablets/laptops and up */}
          <div className="desk items-center gap-3">
            <Link
              to='/login'
              className="hover:bg-white/10 p-2 rounded-full px-6 border border-white text-white"
            >
              Login
            </Link>
            <Link to='/resources' className="p-2 buttonGradient rounded-full px-6 font-semibold">
              Get Started
            </Link>
          </div>

          {/* Mobile/Tablet Menu Toggle Button - Now hides at md (768px) instead of lg */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Menu (Static State Toggle) */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-white text-base py-2 border-b border-white/5 hover:opacity-80 transition-opacity"
            >
              {link.label}
            </Link>
          ))}

          {/* Action Buttons inside the mobile menu container */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="w-full hover:bg-white/10 rounded-full border border-white text-white"
            >
              Login
            </Button>
            <Button onClick={() => navigate('/resources')} className="w-full buttonGradient rounded-full font-semibold">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
