import React, { useState } from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { motion } from "motion/react";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Database, 
  Cpu, 
  RefreshCw, 
  Server, 
  ArrowRight,
  UserCheck
} from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "July 17, 2026";

  return (
    <div className="min-h-screen bg-[#06091b] text-white flex flex-col font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* Background Cosmic Glows */}
      <div
        className="absolute top-0 left-0 w-full h-[900px] pointer-events-none z-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[20%] right-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 75%)",
        }}
      />

      <Navbar />

      {/* Main Container */}
      <main className="flex-grow pt-36 pb-24 px-4 md:px-8 lg:px-24 xl:px-40 relative z-10 w-full">
        {/* Header Block */}
        <div className="mb-16 border-b border-white/[0.06] pb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
            Platform Privacy Standards
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 text-white font-display">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-4 font-light max-w-2xl leading-relaxed">
            This Policy details how ASOC collects, secures, synchronizes, and handles data during the open-source program cohort phase. Your privacy and trust form the foundation of our platform.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-mono text-slate-500">
            <span>DOCUMENT ID: ASOC-PP-2026-V2</span>
            <span className="hidden sm:inline">•</span>
            <span>LAST REVISED: {lastUpdated}</span>
          </div>
        </div>

        {/* Full-Page Content Layout */}
        <div className="space-y-16">
          {/* Visual Process Flow Diagram */}
            <div className="bg-[#0c102b]/30 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 font-mono">
                ASOC Secure Data Processing Lifecycle
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
                {/* Node 1 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-white/5 rounded-xl">
                  <UserCheck className="text-violet-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase font-mono">1. Entry Point</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Apply / Register OAuth</span>
                </div>
                
                <div className="hidden md:flex justify-center text-indigo-500">
                  <ArrowRight size={18} className="animate-pulse" />
                </div>
                
                {/* Node 2 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-white/5 rounded-xl">
                  <RefreshCw className="text-indigo-400 mb-1 animate-spin-slow" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase font-mono">2. GitHub Webhook</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Real-time Pull/Issue Check</span>
                </div>
                
                <div className="hidden md:flex justify-center text-indigo-500">
                  <ArrowRight size={18} className="animate-pulse" />
                </div>
                
                {/* Node 3 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-indigo-500/20 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <Server className="text-cyan-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono">3. Isolation DB</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Encrypted at rest MongoDB</span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section id="information-collect" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">01.</span> Information We Collect
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  To deliver a functional open-source management portal and track leaderboard points accurately, we collect data through direct user input and secure integrations. This is categorized as:
                </p>
                <ul className="list-disc pl-6 space-y-2.5 text-slate-400">
                  <li>
                    <strong className="text-slate-200">Account Credentials & Profiles</strong>: When signing up via email or OAuth, we collect your display name, primary email address, password hashes, and user avatar.
                  </li>
                  <li>
                    <strong className="text-slate-200">GitHub API Metadata</strong>: In order to register contributions, we sync public profile details, user ID, active repositories, branch configurations, commit hashes, pull requests, issue cards, and fork events.
                  </li>
                  <li>
                    <strong className="text-slate-200">Cohort Track Form Details</strong>: Registrants applying for roles (contributors, mentors, ambassadors, sponsors, or project-admins) provide college details, year of study, tech stack preferences, corporate entities, motivation letters, and lists of submitted projects.
                  </li>
                  <li>
                    <strong className="text-slate-200">Support & Communications Log</strong>: When sending queries, support tickets, or registering for newsletter logs, we securely record emails, timestamps, and message threads.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="use-case" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">02.</span> Operational Use of Data
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  ASOC limits data usage solely to program operations, and we strictly enforce a zero-third-party-sharing rule. Your data is used to:
                </p>
                <ul className="list-disc pl-6 space-y-2.5 text-slate-400">
                  <li>Compute contributor points and show real-time leaderboard statistics.</li>
                  <li>Process, review, approve, and download registration track records in secure Excel formats.</li>
                  <li>Integrate and trigger GitHub webhooks to verify pull request merges.</li>
                  <li>Deliver automated email confirmations for newsletter subscriptions and support statuses.</li>
                  <li>Synthesize network traffic flows via isolated, cookie-less browser analytics tags to optimize page speed.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="data-security" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">03.</span> Data Integrity & Security
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  We build with robust web security architectures to shield database records from spam and unauthorized access:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition duration-200">
                    <h4 className="font-semibold text-white text-xs uppercase font-mono mb-2 text-indigo-400">Encryption Standard</h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      All platform data in transit is protected using Industry-Standard TLS/SSL encryption layers. Passwords are salted and hashed using Bcrypt before storage.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition duration-200">
                    <h4 className="font-semibold text-white text-xs uppercase font-mono mb-2 text-indigo-400">Spam & Rate Controls</h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      Sensitive API routers (such as newsletter subscriptions, applications, and support) are restricted by rate limiters that isolate and block malicious traffic instantly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="providers-integrations" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">04.</span> Third-Party Syncs & APIs
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  The platform communicates dynamically with a list of external entities to track contributions. These services include:
                </p>
                <ul className="list-disc pl-6 space-y-2.5 text-slate-400">
                  <li>
                    <strong className="text-slate-200">GitHub Inc.</strong>: To sync public profiles, fetch issue counts, stars, forks, and track pull request hooks.
                  </li>
                  <li>
                    <strong className="text-slate-200">Vercel Inc.</strong>: For hosting the frontend distribution assets and generating application traffic speed reports.
                  </li>
                  <li>
                    <strong className="text-slate-200">MongoDB Atlas</strong>: Hosting the secure cloud cluster databases.
                  </li>
                </ul>
                <p className="text-xs text-slate-500 italic mt-3">
                  Note: These external systems run under their own respective privacy rules. We recommend reviewing GitHub and Vercel privacy disclosures for comprehensive details.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="rights-consent" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">05.</span> Participant Rights & Contact
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  As an ASOC cohort participant, you maintain absolute control over your personal data. You possess the right to request a full CSV export of your profile logs, correct incorrect registration entries, or demand complete deletion of your account records.
                </p>
                <p>
                  To execute any data request, or if you have questions regarding these guidelines, please contact our core support squad directly.
                </p>
              </div>
            </section>

            {/* Support Trigger Box */}
            <div className="mt-12 p-8 rounded-3xl border border-white/[0.06] text-center bg-indigo-950/10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-[200px] h-[200px] pointer-events-none opacity-5 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-xl" />
              <h3 className="text-lg font-bold text-white mb-2">Have questions about your data?</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto font-light leading-relaxed mb-6">
                If you need clarification about OAuth scopes, webhook integrations, or data logs, reach out to us. We typically reply within 24 hours.
              </p>
              <div className="flex justify-center">
                <a
                  href="/support"
                  className="buttonGradient py-2.5 px-6 rounded-full font-semibold text-xs text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                >
                  <CheckCircle2 size={14} /> Open Support Ticket
                </a>
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
}
