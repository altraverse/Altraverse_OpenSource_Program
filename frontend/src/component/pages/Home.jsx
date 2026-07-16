import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Navbar from "@/component/layout/Navbar";
// import Footer from "@/component/layout/Footer";
// import Hero from "@/component/home/Hero";
import WhyJoin from "@/component/home/WhyJoin";
import Stats from "@/component/home/Stats";
import EventSection from "@/component/home/EventSection";
import Hero from "../home/Hero";
import Footer from "../../components/footer";
import { InteractiveNetworkBackground } from "../../components/interactive-network-background";
import Timeline from "@/component/home/Timeline";
import Roles from "@/component/home/Roles";




const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Home() {
  const navigate = useNavigate();
  // useEffect(() => {
  //   // // @ts-ignore
  //    if (window.particlesJS) {
  //      // @ts-ignore
  //      window.particlesJS.load("star", "/net.json", function() {
  //        console.log("callback - particles.js config loaded");
  //      });
  //    }
  // }, []);

  return (
    <div className="min-h-screen bg-[#06091b] text-white overflow-x-hidden selection:bg-indigo-500/30 relative">
      {/* Background Mesh Glow Layers for the entire Home Page */}
      <div
        className="absolute top-0 left-0 w-full h-[1500px] pointer-events-none z-0 opacity-30"
        style={{ background: "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(91,63,214,0.22) 0%, transparent 65%)" }}
      />
      <div
        className="absolute top-[1800px] right-0 w-[900px] h-[900px] pointer-events-none z-0 opacity-20"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 75%)" }}
      />
      <div
        className="absolute bottom-[800px] left-0 w-[900px] h-[900px] pointer-events-none z-0 opacity-15"
        style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 75%)" }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Sponsors Section (Marquee / Grid) */}
      <section className="py-12 border-b border-white/[0.06] bg-transparent relative z-10 overflow-hidden">
        {/* Style block for continuous scrolling marquee */}
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            display: flex;
            overflow: hidden;
            user-select: none;
            width: 100%;
            mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          }
          .marquee-content {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-around;
            min-width: 100%;
            gap: 4rem;
            animation: marquee-scroll 25s linear infinite;
          }
          .marquee-container:hover .marquee-content {
            animation-play-state: paused;
          }
        `}</style>

        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">
            Backed By Industry Leaders
          </p> */}

        {/* <div className="marquee-container opacity-60 grayscale hover:grayscale-0 transition-all duration-500"> */}
        {/* Set 1 */}
        {/* <div className="marquee-content">
              {["Vercel", "GitHub", "DigitalOcean", "JetBrains", "Discord", "Google", "Amazon", "Microsoft", "Meta", "Netflix", "Slack", "Intel"].map(
                (sponsor, i) => (
                  <div
                    key={`s1-${i}`}
                    className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2 text-white"
                  >
                    {sponsor}
                  </div>
                )
              )}
            </div> */}

        {/* Set 2 (duplicates for infinite loop) */}
        {/* <div className="marquee-content" aria-hidden="true"> */}
        {/* {["Vercel", "GitHub", "DigitalOcean", "JetBrains", "Discord", "Google", "Amazon", "Microsoft", "Meta", "Netflix", "Slack", "Intel"].map(
                (sponsor, i) => (
                  <div
                    key={`s2-${i}`}
                    className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2 text-white"
                  >
                    {sponsor}
                  </div>
                )
              )}
            </div>
          </div>
        </div> */}
      </section>

      {/* Program Timeline */}
      <Timeline />

      {/* How it Works / Timeline */}
      <EventSection />

      {/* Why ASOC */}
      <WhyJoin />

      {/* Roles & Participation */}
      <Roles />

      {/* Stats and Community Banner Wrapper */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-16 bg-transparent z-10">
        <div className="max-w-7xl mx-auto">
          {/* Community Banner Section - Overhauled to GSSoC / Nexus Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c102b]/30 backdrop-blur-md p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row justify-between items-center gap-12 shadow-[0_20px_50px_rgba(99,102,241,0.1)]"
          >
            {/* Interactive Network background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
              <InteractiveNetworkBackground />
            </div>

            {/* Glowing Accent Orbs */}
            <div className="absolute -left-20 -top-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Content (Left) */}
            <div className="relative z-10 max-w-xl text-left flex-1">
              <div className="inline-flex items-center gap-2 mb-4 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                  Open Source Is For Everyone
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display leading-[1.15] text-white tracking-tight my-4">
                Build the future,
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">one commit at a time.</span>
              </h3>

              <p className="text-slate-400 leading-relaxed text-sm sm:text-base mb-8 font-light">
                Whether you are an absolute beginner writing your first line of code or a seasoned open-source veteran, ASOC provides the mentorship, tools, and community to accelerate your contribution journey.
              </p>

              <Button onClick={() => navigate('/projects')} className="buttonGradient py-6 px-8 rounded-full font-semibold text-sm shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer">
                Start Contributing
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Orbiting Coding Tokens Grid (Right) */}
            <div className="relative z-10 w-full max-w-[340px] aspect-square flex justify-center items-center flex-shrink-0">
              {/* Central Core Glow */}
              <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl opacity-20 animate-pulse" />

              {/* Outer border rings */}
              <div className="absolute w-72 h-72 rounded-full border border-white/[0.04] animate-[spin_50s_linear_infinite]" />
              <div className="absolute w-52 h-52 rounded-full border border-dashed border-white/[0.06] animate-[spin_30s_linear_infinite_reverse]" />

              {/* Orb 1: Git */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-4 left-6 bg-[#0c102b]/90 border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-mono text-[10px] text-white/80 font-bold uppercase tracking-wider">Git</span>
              </motion.div>

              {/* Orb 2: React */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-16 right-4 bg-[#0c102b]/90 border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] text-white/80 font-bold uppercase tracking-wider">React</span>
              </motion.div>

              {/* Orb 3: Python */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.2 }}
                className="absolute bottom-20 left-2 bg-[#0c102b]/90 border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-mono text-[10px] text-white/80 font-bold uppercase tracking-wider">Python</span>
              </motion.div>

              {/* Orb 4: Rust */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-6 right-10 bg-[#0c102b]/90 border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-mono text-[10px] text-white/80 font-bold uppercase tracking-wider">Rust</span>
              </motion.div>

              {/* Center ASOC logo bubble */}
              <div className="w-24 h-24 rounded-full bg-[#0c102b] border border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.25)] flex flex-col justify-center items-center select-none">
                <span className="text-sm font-black tracking-widest text-white">ASOC</span>
                <span className="text-[7px] font-mono tracking-widest text-indigo-400 font-bold mt-1">COHORT</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {/* <Stats /> */}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-16 bg-transparent text-white border-t border-white/[0.06] relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-white bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full space-y-4"
          >
            <AccordionItem
              value="item-1"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                Who can participate in the program?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Anyone passionate about open source, from beginners to experienced developers, is welcome to join.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                How do I make my first contribution?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Choose a beginner-friendly issue, follow the contribution guide, and submit your first pull request.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                How are issues assigned, and can I work on multiple issues at once?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Issues are assigned according to project guidelines, and contributors should work on one issue at a time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                What happens if my pull request is not accepted?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Maintainers provide feedback so you can improve your submission and resubmit it.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                How can I register my open-source project as a Project Admin?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Submit your project through the official project registration process, ensuring it meets the eligibility guidelines.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                What are the responsibilities of mentors and project maintainers?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Mentors guide contributors, review pull requests, and help maintain project quality throughout the program.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                How can I become an ambassador, and what will I do?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Anyone passionate about community building can apply; ambassadors promote the program, organize events, and support participants.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-8"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                How can an organization become a sponsor or partner?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Organizations can apply through the sponsorship or partnership forms to support the program and collaborate with the community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-9"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                What benefits will participants receive after successfully completing the program?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Successful participants receive certificates, recognition, and may earn additional rewards such as swag or other program-specific perks.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-10"
              className="bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 px-6 rounded-xl border border-slate-800/50 shadow-xl"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4 text-white hover:text-indigo-400 transition-colors duration-200 text-left text-base sm:text-lg">
                Can I continue contributing after the program ends?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4 text-sm sm:text-base leading-relaxed text-left">
                Yes. The projects remain open source, and contributors are encouraged to stay involved with the community even after the program concludes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
      <Footer />
    </div>
  );
}

export default Home;
