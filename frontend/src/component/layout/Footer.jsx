import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand1 pt-20 pb-10 border-t border-white/10 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="font-black text-2xl tracking-tighter mb-4 textGradient inline-block">
              ASOC
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering developers worldwide to learn, collaborate, and create
              impact through open source.
            </p>
            <div className="flex gap-4">
              <Link
                to="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
                {/* <Github className="w-5 h-5" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
              </Link>
              <Link
                to="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
                {/* <Twitter className="w-5 h-5" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4l11.733 16h4.267l-11.733 -16l-4.267 0" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </Link>
              <Link
                to="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
                {/* <Linkedin className="w-5 h-5" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 11v5" />
                  <path d="M8 8v.01" />
                  <path d="M12 16v-5" />
                  <path d="M16 16v-3a2 2 0 1 0 -4 0" />
                  <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white">Programs</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Contributors
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Project Admins
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Ambassadors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Code of Conduct
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Swag Store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Stay updated with our latest news and announcements.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
              />

              <Button className="buttonGradient shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ASOC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
