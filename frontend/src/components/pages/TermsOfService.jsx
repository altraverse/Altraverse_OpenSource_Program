import React, { useState } from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import { motion } from "motion/react";
import { 
  Scale, 
  Users, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Code, 
  GitPullRequest, 
  Award,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export default function TermsOfService() {
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-wider text-violet-300">
            Platform Legal framework
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 text-white font-display">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-4 font-light max-w-2xl leading-relaxed">
            Please read these terms carefully. They establish the rules, expectations, code of conduct, and leaderboard policies for participating in the ASOC open-source program.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-mono text-slate-500">
            <span>DOCUMENT ID: ASOC-TOS-2026-V2</span>
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
                ASOC Contributor Progression Flow
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 text-center">
                {/* Node 1 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-white/5 rounded-xl col-span-1">
                  <Users className="text-violet-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase font-mono">1. Register</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Apply Cohort</span>
                </div>
                
                <div className="hidden md:flex justify-center text-indigo-500 col-span-1">
                  <ArrowRight size={18} className="animate-pulse" />
                </div>
                
                {/* Node 2 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-white/5 rounded-xl col-span-1">
                  <GitPullRequest className="text-indigo-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase font-mono">2. Code Merge</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">PRs Accepted</span>
                </div>
                
                <div className="hidden md:flex justify-center text-indigo-500 col-span-1">
                  <ArrowRight size={18} className="animate-pulse" />
                </div>
                
                {/* Node 3 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-white/5 rounded-xl col-span-1">
                  <Award className="text-cyan-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase font-mono">3. Sync Ranks</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Points Updates</span>
                </div>

                <div className="hidden md:flex justify-center text-indigo-500 col-span-1">
                  <ArrowRight size={18} className="animate-pulse" />
                </div>

                {/* Node 4 */}
                <div className="flex flex-col items-center p-3 bg-slate-900/50 border border-indigo-500/20 rounded-xl col-span-1 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <CheckCircle2 className="text-emerald-400 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-emerald-300 uppercase font-mono">4. Certify</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Earn Recognition</span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section id="acceptance-eligibility" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">01.</span> Acceptance & Eligibility
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  By registering an account, configuring repository webhooks, or making commits on the ASOC platform, you agree to comply with and be bound by these Terms of Service. If you do not consent to these rules, you must not access or use the application.
                </p>
                <ul className="list-disc pl-6 space-y-2.5 text-slate-400">
                  <li>
                    <strong className="text-slate-200">Age Limitations</strong>: You must be at least 13 years old to use the platform. If you are under 18, you represent that your legal parent or guardian has reviewed and accepted these terms.
                  </li>
                  <li>
                    <strong className="text-slate-200">GitHub Authentication</strong>: Accessing active tracks requires a validated personal GitHub profile.
                  </li>
                  <li>
                    <strong className="text-slate-200">Community Respect</strong>: All participants must agree to support a collaborative and inclusive workspace.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="account-security" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">02.</span> Credentials & Security
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  When applying for program roles, you are responsible for maintaining the privacy of your session cookies and API integration tokens.
                </p>
                <p>
                  You agree to notify our support team immediately in the event of unauthorized account access, API compromises, or credential leaks. ASOC cannot and will not be liable for losses caused by unauthorized credential configurations.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="acceptable-contributions" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">03.</span> Code Contributions & Open Source Licenses
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  To keep the leaderboard fair and the repositories functional, contributors commit to honest open-source development practices:
                </p>
                <ul className="list-disc pl-6 space-y-2.5 text-slate-400">
                  <li>
                    <strong className="text-slate-200">Original Submissions</strong>: All pull requests and issues must consist of original work or be appropriately licensed under open-source licenses (such as MIT, Apache 2.0, or GPL).
                  </li>
                  <li>
                    <strong className="text-slate-200">No Spam Commits</strong>: Submitting unhelpful, minor, duplicate, or boilerplate PRs solely to accumulate leaderboard rankings is strictly forbidden.
                  </li>
                  <li>
                    <strong className="text-slate-200">Maintainer Decisions</strong>: Project admins and mentors hold final authority over reviewing and approving commits. Harassment of reviewers will result in an immediate platform ban.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="points-leaderboard" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">04.</span> Leaderboard Calculations & Rewards
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  Rankings on the ASOC dashboard reflect real-time API scans:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition duration-200">
                    <h4 className="font-semibold text-white text-xs uppercase font-mono mb-2 text-indigo-400">Points Calculation</h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      Points are assigned based on repository tags and complexity. ASOC reserves the right to modify multipliers and point distributions at any time.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition duration-200">
                    <h4 className="font-semibold text-white text-xs uppercase font-mono mb-2 text-indigo-400">Disqualification Rules</h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      Attempts to game the points system (such as creating puppet repositories or using bots) will lead to immediate disqualification and points forfeiture.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="liability-limits" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-lg">05.</span> Limitations of Liability & Disclaimers
              </h2>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  The ASOC platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
                </p>
                <p>
                  Under no circumstances shall ASOC, its administrators, partners, or project maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from connection issues, system failures, API downtime, or data loss.
                </p>
              </div>
            </section>

            {/* Support Trigger Box */}
            <div className="mt-12 p-8 rounded-3xl border border-white/[0.06] text-center bg-indigo-950/10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-[200px] h-[200px] pointer-events-none opacity-5 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-xl" />
              <h3 className="text-lg font-bold text-white mb-2">Need clarification on these terms?</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto font-light leading-relaxed mb-6">
                If you have questions regarding licenses, contribution rules, or leaderboard calculations, contact us.
              </p>
              <div className="flex justify-center">
                <a
                  href="/support"
                  className="buttonGradient py-2.5 px-6 rounded-full font-semibold text-xs text-white shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                >
                  <CheckCircle2 size={14} /> Contact Support
                </a>
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
}
