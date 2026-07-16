import React, { useState } from "react";
import API from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import logo from "../../assets/logo.png"

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await API.post("/api/newsletter/subscribe", { email });
      if (response.data.success) {
        setStatus({
          type: "success",
          message: response.data.message || "Subscribed successfully!"
        });
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <footer className="bg-brand1 pt-20 pb-10 border-t border-white/10 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-1 group">
              <img
                src={logo}
                alt="ASOC Logo"
                className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <h2 className="font-black text-2xl tracking-tighter mb-4 textGradient inline-block">
                ASOC
              </h2>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering developers worldwide to learn, collaborate, and create
              impact through open source
            </p>
            <div className="flex gap-4">
              {/* <Link
                to="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              > */}
              {/* <Github className="w-5 h-5" /> */}
              {/* <svg
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
              </Link> */}
              {/* <Link
                to="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              > */}
              {/* <Twitter className="w-5 h-5" /> */}
              {/* <svg
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
              </Link> */}
              <Link
                to="https://www.linkedin.com/company/altraverse"
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
              <Link
                to="https://www.instagram.com/altraverse.in/"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M16.5 7.5v.01" />
                </svg>
              </Link>
              <Link
                to="https://www.youtube.com/@altraverseofficial"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4z" />
                  <path d="M10 9l5 3l-5 3z" />
                </svg>
              </Link>
              <Link
                to="https://www.threads.net/@altraverse.in"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 192 192"
                  fill="currentColor"
                  className="icon"
                >
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white">Programs</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  to="/roles/contributor"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Contributors
                </Link>
              </li>
              <li>
                <Link
                  to="/become-mentor"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="/roles/project-admin"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Project Admins
                </Link>
              </li>
              <li>
                <Link
                  to="/roles/ambassador"
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
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-500 transition-colors text-white"
                  required
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="buttonGradient shrink-0"
                >
                  {submitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {status.message && (
                <p className={`text-xs mt-1 ${status.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ASOC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
