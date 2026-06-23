import React from "react";

// 1. Move static configuration data outside the component to prevent re-allocation on re-renders
const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" }, // Assuming a routing framework or internal id
  { label: "Announcements", href: "/announcement" },
  { label: "Resources", href: "/resources" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#06091b77]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">

        {/* Brand Identity / Logo */}
        <div className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:scale-105 transition-transform duration-200">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1.5 3.5H11.5l-3 2.4 1.1 3.8L6 9 2.4 10.7l1.1-3.8L.5 4.5H5z" fill="white" />
            </svg>
          </div>
          <span className="font-display text-[15px] font-bold text-white/60 group-hover:text-white/80 transition-colors duration-200 tracking-wide">
            ASOC
          </span>
        </div>

        {/* Modular Navigation Tree */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-[12px] text-white/30 hover:text-white/70 transition-colors duration-200 relative py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Dynamic Legal & Copyright Notice */}
        <div className="font-body text-[11px] text-white/25 text-center sm:text-right select-none">
          &copy; {currentYear} ASOC. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
