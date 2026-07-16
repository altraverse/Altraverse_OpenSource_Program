import React from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { motion } from "motion/react";
import { Scale, Users, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "July 16, 2026";

  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the ASOC platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not access or use the platform. These terms apply to all visitors, contributors, mentors, and administrators.",
    },
    {
      icon: Users,
      title: "2. Account Registration & Security",
      content:
        "To participate in the program tracks (contributor, mentor, ambassador, or project admin), you must register for an account. You are responsible for keeping your credentials secure, including GitHub tokens and OAuth permissions. Any activity under your account is your sole responsibility.",
    },
    {
      icon: ShieldAlert,
      title: "3. Acceptable Conduct & Contributions",
      content:
        "All contributions, including pull requests, comments, and project registrations, must adhere to our community guidelines. Spamming commits, submitting unhelpful or duplicate pull requests, or harassing other developers is strictly prohibited and may result in account termination.",
    },
    {
      icon: FileText,
      title: "4. Leaderboard & Points System",
      content:
        "The points and leaderboard rankings on ASOC are calculated based on accepted pull requests and repository activity synced via Webhooks. ASOC reserves the right to modify the points system or disqualify participants found engaging in gaming the leaderboard.",
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
              Legal Terms
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 text-white">
              Terms of Service
            </h1>
            <p className="text-slate-400 text-sm mt-3 font-light">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c102b]/40 backdrop-blur-md p-6 mb-8 flex items-start gap-4 shadow-xl">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-300">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Please read these terms carefully</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-light">
                These Terms of Service govern your relationship with the ASOC platform. By participating in this cohort, you commit to honest, collaborative open source development.
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
            <h3 className="text-lg font-bold text-white mb-2">Have questions about our Terms?</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-light leading-relaxed mb-6">
              If you have any questions or require clarifications regarding these terms, rights, and responsibilities, please feel free to reach out.
            </p>
            <div className="flex justify-center gap-2">
              <a
                href="/support"
                className="buttonGradient py-2.5 px-6 rounded-full font-semibold text-xs text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <CheckCircle2 size={14} /> Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
