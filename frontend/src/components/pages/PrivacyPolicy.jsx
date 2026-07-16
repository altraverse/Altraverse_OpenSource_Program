import React from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "July 16, 2026";

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content:
        "We collect information that you directly provide to us, including when you register for an account, apply for a role (contributor, mentor, ambassador, or project admin), submit support requests, or communicate with us. This information may include your name, email address, GitHub username, college name, and other details relevant to your participation.",
    },
    {
      icon: Lock,
      title: "2. How We Use Your Information",
      content:
        "We use the collected information to manage your account, process applications for various tracks, calculate points, sync issues via GitHub Webhooks, display public achievements on the leaderboard, and respond to support queries. We do not sell or rent your personal information to third parties.",
    },
    {
      icon: Shield,
      title: "3. Cookies & Local Storage",
      content:
        "ASOC uses cookies and similar local storage technologies to maintain your session, persist authentication tokens, remember preferences, and gather analytics on site performance. You can disable cookies in your browser settings, though some features of the platform may cease to function correctly.",
    },
    {
      icon: FileText,
      title: "4. Third-Party Integrations & Links",
      content:
        "Our platform integrates with third-party services such as GitHub APIs and Discord. These integrations are subject to the respective privacy policies of those external services. We are not responsible for the privacy practices of third-party platforms.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06091b] text-white flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Background Glow Layers */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(91,63,214,0.3) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 75%)",
        }}
      />

      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-16 pb-16 relative z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Title */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-wider text-violet-300">
              Platform Terms
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 text-white">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-sm mt-3 font-light">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c102b]/40 backdrop-blur-md p-6 mb-8 flex items-start gap-4 shadow-xl">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-300">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Your privacy is important to us</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-light">
                ASOC is committed to maintaining the trust and confidence of our participants. This Privacy Policy details how we handle information, cookies, credentials, and third-party API sync processes to secure our database logs.
              </p>
            </div>
          </div>

          {/* Policy Sections Grid */}
          <div className="space-y-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 sm:p-8 rounded-2xl border border-white/[0.05] bg-[#0c102b]/20 backdrop-blur-md shadow-lg"
                >
                  <div className="flex items-center gap-3.5 mb-4 border-b border-white/[0.04] pb-3">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-wide">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Notice */}
          <div className="mt-12 p-8 rounded-2xl border border-dashed border-white/10 text-center bg-slate-950/20 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-2">Have questions or concerns?</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-light leading-relaxed mb-6">
              If you have any questions regarding this Privacy Policy, your personal data, or integrations, feel free to contact us or raise a support ticket.
            </p>
            <div className="flex justify-center gap-2">
              <a
                href="/support"
                className="buttonGradient py-2.5 px-6 rounded-full font-semibold text-xs text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <CheckCircle2 size={14} /> Open Support Ticket
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
