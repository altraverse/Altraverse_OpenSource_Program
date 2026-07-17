import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Code,
  Laptop,
  Trophy,
  ArrowRight,
} from "lucide-react";
import API from "../../api/axios";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import { InteractiveNetworkBackground } from "../interactive-network-background";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await API.post("/api/auth/register", formData);
      if (response.data.success) {
        // Redirect to OTP verification with email as a query parameter
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Code,
      title: "Find Projects",
      desc: "Explore open projects and claim beginner-friendly tasks.",
    },
    {
      icon: Laptop,
      title: "Get Guidance",
      desc: "Team up with experienced maintainers and industry mentors.",
    },
    {
      icon: Trophy,
      title: "Earn Points",
      desc: "Submit pull requests, complete goals, and climb the rank.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06091b] text-white overflow-x-hidden selection:bg-indigo-500/30 relative flex flex-col justify-between">
      {/* Background Mesh Glow Layers */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(91,63,214,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] pointer-events-none z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 75%)",
        }}
      />

      {/* Interactive Network Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <InteractiveNetworkBackground />
      </div>

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-16 pt-32 pb-16">
        <main className="flex flex-1 flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Left Column: Welcoming & Feature Grid */}
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
              Create{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(167,139,250,0.3)]">
                Account
              </span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-300 font-light">
              Join India's largest open source cohort movement.
            </p>

            <div className="hidden md:flex mt-10 space-y-6 w-fit mx-auto lg:mx-0 flex-col items-start">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:text-left lg:items-center group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover:border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                      <Icon
                        size={20}
                        className="text-indigo-300 group-hover:text-white transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-400 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Right Column: Register Card */}
          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c102b]/40 p-8 sm:p-10 shadow-[0_20px_50px_rgba(99,102,241,0.15)] backdrop-blur-xl"
          >
            {/* Top Glowing Indicator Border */}
            <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_20px_#6366f1]" />

            {/* Subtle Orb Glow inside Card */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Register account
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-light">
                Glad to have you onboard!
              </p>

              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {serverError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${errors.name ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${errors.email ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${errors.password ? "border-red-500/50" : "border-white/[0.08]"
                        }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] font-sans"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending Verification Code...
                    </span>
                  ) : (
                    <>
                      Get Verification Code <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400 font-light">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </motion.section>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
