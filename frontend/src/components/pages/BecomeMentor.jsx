import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, GraduationCap, Award, Gift, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { Button } from "@/components/ui/button";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function BecomeMentor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    repository: "",
    techStack: "",
    motivation: "",
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleGuestInteraction = (e) => {
    if (!user) {
      e.stopPropagation();
      e.preventDefault();
      alert("You must create an account or log in to apply as a mentor. Redirecting to register page...");
      navigate("/register");
    }
  };

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const benefits = [
    {
      icon: GraduationCap,
      title: "Shape the Future",
      desc: "Mentor passionate student developers, helping them solve real-world problems and start their open-source journey.",
      color: "text-blue-400"
    },
    {
      icon: Award,
      title: "Official Recognition",
      desc: "Receive an official Mentor Certificate, special portal badges, and recognition across our social channels.",
      color: "text-purple-400"
    },
    {
      icon: Gift,
      title: "Premium Swags",
      desc: "Get exclusive mentor-only ASOC hoodies, stainless bottles, tech stickers, and developer gear delivered to your door.",
      color: "text-pink-400"
    },
    {
      icon: Sparkles,
      title: "Global Network",
      desc: "Collaborate with program maintainers, sponsor representatives, and other experienced tech professionals in our private channel.",
      color: "text-amber-400"
    }
  ];

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.github.trim()) {
      newErrors.github = "GitHub username or profile link is required";
    }
    if (!formData.repository.trim()) {
      newErrors.repository = "Repository / Project suggestion link is required";
    }
    if (!formData.techStack.trim()) {
      newErrors.techStack = "Please specify the technologies used";
    }
    if (formData.motivation.trim().length < 20) {
      newErrors.motivation = "Please write a brief explanation (at least 20 characters)";
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must create an account or log in to apply as a mentor. Redirecting to register page...");
      navigate("/register");
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await API.post("/api/mentors/apply", formData);
      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setSubmitError("You must be logged in to apply as a mentor. Redirecting to login page...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSubmitError(
          err.response?.data?.message || "Failed to submit your application. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-screen flex flex-col justify-between antialiased relative overflow-hidden bg-slate-950 text-white">
      {/* Background ambient glow effect */}
      <div
        className="absolute top-[25%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full pointer-events-none z-0 opacity-60"
        style={{
          boxShadow: "0px 0px 220px 80px rgba(99,102,241,0.3)"
        }}
      />
      <div
        className="absolute bottom-[15%] left-[10%] w-10 h-10 rounded-full pointer-events-none z-0 opacity-40"
        style={{
          boxShadow: "0px 0px 180px 60px rgba(236,72,153,0.15)"
        }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-28 md:py-36 space-y-20 flex-grow w-full relative z-10">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-widest text-indigo-400 uppercase inline-block"
          >
            Become an ASOC Mentor
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
          >
            Guide the Next Generation of Developers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Share your expertise, lead open-source projects, and elevate your leadership skills by mentoring student contributors.
          </motion.p>
        </section>

        {/* Perks / Benefits Grid */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-white">Why Mentor with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-md hover:border-white/10 transition-colors shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 mb-4">
                      <Icon className={`w-5 h-5 ${perk.color}`} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{perk.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{perk.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Interactive Application Form Card */}
        <section className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-b from-slate-900/40 via-slate-950/60 to-black/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Application Form</h3>
                  <p className="text-slate-400 text-sm">Tell us about your project and details. We will reach back to you shortly.</p>
                  {submitError && (
                    <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} onClickCapture={handleGuestInteraction} className="space-y-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.name ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email Address</label>
                    <input
                      readOnly={!!user}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@example.com"
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        user ? "cursor-not-allowed text-slate-400 opacity-70" : ""
                      } ${
                        errors.email ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* GitHub Profile */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="github" className="text-sm font-semibold text-slate-300">GitHub Profile / Username</label>
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="e.g. github.com/johndoe or johndoe"
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.github ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.github && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.github}
                      </span>
                    )}
                  </div>

                  {/* Proposed Repo Link */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="repository" className="text-sm font-semibold text-slate-300">Project / Repository Link to Mentor</label>
                    <input
                      type="text"
                      id="repository"
                      name="repository"
                      value={formData.repository}
                      onChange={handleInputChange}
                      placeholder="e.g. github.com/username/project"
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.repository ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.repository && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.repository}
                      </span>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="techStack" className="text-sm font-semibold text-slate-300">Primary Technologies Used</label>
                    <input
                      type="text"
                      id="techStack"
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleInputChange}
                      placeholder="e.g. React, TypeScript, Go, Python"
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.techStack ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.techStack && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.techStack}
                      </span>
                    )}
                  </div>

                  {/* Motivation / Experience */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="motivation" className="text-sm font-semibold text-slate-300">Why do you want to be a mentor for ASOC?</label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe your project, code background, or motivation in guiding student developers..."
                      className={`px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                        errors.motivation ? "border-rose-500/60 ring-1 ring-rose-500/40" : "border-white/10"
                      }`}
                    />
                    {errors.motivation && (
                      <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.motivation}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-6 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-slate-900/30 border border-emerald-500/20 rounded-3xl p-10 backdrop-blur-xl shadow-2xl text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-extrabold text-white">Application Received!</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Thank you for applying to be a mentor, <span className="text-indigo-400 font-semibold">{formData.name}</span>. Our organization admins will review your application and project repository.
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 text-sm text-slate-400 max-w-sm mx-auto">
                  You will receive an email verification at <span className="text-white">{formData.email}</span> within the next 5-7 business days.
                </div>
                <div className="pt-4">
                  <Link to="/">
                    <Button variant="ghost" className="border border-white/10 text-white rounded-xl px-6 hover:bg-white/5">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      <Footer />
    </div>
  );
}
