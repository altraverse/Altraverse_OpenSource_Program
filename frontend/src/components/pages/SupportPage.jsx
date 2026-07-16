import React, { useState, useEffect } from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { Send, HelpCircle, Mail, MessageSquare, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function SupportPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Query",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // types: "success", "error"

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await API.post("/api/support", formData);
      if (response.data.success) {
        setStatus({
          type: "success",
          message: response.data.message || "Your ticket has been raised successfully!",
        });
        setFormData((prev) => ({
          ...prev,
          message: "", // Reset only message box
        }));
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to submit support request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06091b] text-white flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Background Glows */}
      <div
        className="absolute top-0 right-0 w-full h-[600px] pointer-events-none z-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 70% 20%, rgba(99,102,241,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 75%)",
        }}
      />

      <Navbar />

      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-16 pb-16 relative z-10 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          
          {/* Left Column: Information Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                Helpdesk & Support
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-white">
                Submit a Support Ticket
              </h1>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed font-light">
                Facing an error, connection bug, or problem with your applications? Fill in the details to contact our administrator directly.
              </p>
            </div>

            {/* Guide cards */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-white/[0.04] bg-[#0c102b]/20 backdrop-blur-md">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-fit">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Choose Subject Wisely</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-1 font-light">
                    Select a suitable category to help route your issue to the correct moderator.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-white/[0.04] bg-[#0c102b]/20 backdrop-blur-md">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-fit">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Valid Email Contact</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-1 font-light">
                    Ensure your email address is correct as response notifications will be sent directly there.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-white/[0.04] bg-[#0c102b]/20 backdrop-blur-md">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-fit">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Admin Dashboard View</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-1 font-light">
                    Once submitted, our admin panel monitors, logs, and resolves tickets synchronously.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#0c102b]/30 border border-white/[0.06] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-indigo-500 to-purple-600" />

              {status.type && (
                <div
                  className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm border ${
                    status.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  <div className="mt-0.5">
                    {status.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div className="font-light leading-relaxed">{status.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={submitting}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-950/40 border border-white/5 hover:border-white/10 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3.5 focus:outline-none transition disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={submitting}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-950/40 border border-white/5 hover:border-white/10 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3.5 focus:outline-none transition disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                    Subject / Category
                  </label>
                  <select
                    name="subject"
                    disabled={submitting}
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-white/5 hover:border-white/10 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3.5 focus:outline-none transition disabled:opacity-50 cursor-pointer"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Bug Report / Error">Bug Report / Error</option>
                    <option value="Account Access / Login">Account Access / Login</option>
                    <option value="Role Track Issue">Role Track Issue</option>
                    <option value="Project Registration">Project Registration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                    Message Details
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    disabled={submitting}
                    placeholder="Describe what error or event occurred, and any details that can help us troubleshoot..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-slate-950/40 border border-white/5 hover:border-white/10 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-4 py-3.5 focus:outline-none transition disabled:opacity-50 leading-relaxed font-light"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Raising Support Ticket...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Support Request
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
