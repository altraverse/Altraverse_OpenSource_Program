import { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  CheckCircle2, 
  Code, 
  FileInput, 
  Award, 
  ShieldAlert, 
  Users2, 
  Trophy, 
  Terminal, 
  Sparkles 
} from "lucide-react";

const phase1Events = [
  {
    date: "20 July – 20 August",
    title: "Contributor Registration Opens",
    description: "Browse the participating open-source projects, talk to mentors, and submit your registration application.",
    icon: FileInput,
  },
  {
    date: "23 August",
    title: "Contribution Period Starts",
    subtitle: "On the occasion of National Space Day, India",
    description: "Coding begins! Claim issues, submit pull requests, and start collaborating with project maintainers.",
    icon: Code,
  },
  {
    date: "20 September",
    title: "Contributor Registration Closes",
    description: "Final deadline to register as a contributor. Make sure all your details are up to date.",
    icon: ShieldAlert,
  },
  {
    date: "1 October – 3 October",
    title: "Evaluation 1",
    subtitle: "Performance Review (mid term)",
    description: "Mentors review early progress and contributions. Feedback is provided to keep everyone on track.",
    icon: Calendar,
  }
];

const phase2Events = [
  {
    date: "4 October",
    title: "Team Announcement",
    subtitle: "Reveal Hackathon Teams & Team Leads",
    description: "Hackathon teams and selected team leads are announced to prep for the build phase.",
    icon: Users2,
  },
  {
    date: "5 October – 9 October (5 Days)",
    title: "Hackathon",
    subtitle: "Build Real Projects",
    description: "Work in teams to build innovative real-world projects and showcase developer capability.",
    icon: Terminal,
  },
  {
    date: "10 October",
    title: "Demo Day",
    subtitle: "Final Presentations",
    description: "Present your built project to judges and community experts.",
    icon: Trophy,
  },
  {
    date: "17 October",
    title: "Results",
    subtitle: "Winners & Recognition",
    description: "Final results announcement, recognition of winning teams, and certificate/reward distribution.",
    icon: Award,
  }
];

export default function Timeline() {
  const [activePhase, setActivePhase] = useState("phase1");
  const isPhase1 = activePhase === "phase1";
  const events = isPhase1 ? phase1Events : phase2Events;

  // Theming configuration
  const themeColor = isPhase1 ? "indigo" : "amber";
  const accentText = isPhase1 ? "text-indigo-400" : "text-amber-400";
  const accentBg = isPhase1 ? "bg-indigo-500/10" : "bg-amber-500/10";
  const accentBorder = isPhase1 ? "border-indigo-500/20" : "border-amber-500/20";
  const hoverBorder = isPhase1 ? "hover:border-indigo-500/40" : "hover:border-amber-500/40";
  const glowShadow = isPhase1 ? "shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "shadow-[0_0_15px_rgba(245,158,11,0.3)]";
  const borderNode = isPhase1 ? "border-indigo-500" : "border-amber-500";
  const nodeIconText = isPhase1 ? "text-indigo-400" : "text-amber-400";
  const lineGradient = isPhase1 
    ? "bg-gradient-to-b from-indigo-500 via-violet-500 to-indigo-500"
    : "bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500";
  const hoverGlowLine = isPhase1 ? "via-indigo-500/20" : "via-amber-500/20";

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#06091b] overflow-hidden border-b border-white/5">
      {/* Decorative Atmospheric Cosmic Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-30 blur-[100px] transition-all duration-700"
        style={{
          background: isPhase1 
            ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 80%)"
            : "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 80%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-80 h-80 pointer-events-none opacity-20 blur-[100px] transition-all duration-700"
        style={{
          background: isPhase1
            ? "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 80%)"
            : "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 80%)"
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <div className={`h-px w-8 bg-gradient-to-r ${isPhase1 ? 'from-violet-400' : 'from-amber-400'} to-transparent`} />
            <span className={`font-mono text-[10px] font-bold tracking-[0.22em] uppercase ${isPhase1 ? 'text-violet-400' : 'text-amber-400'}`}>
              Roadmap & Milestones
            </span>
            <div className={`h-px w-8 bg-gradient-to-l ${isPhase1 ? 'from-violet-400' : 'from-amber-400'} to-transparent`} />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight font-display"
          >
            Program <span className="gradient-text">Timeline</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/50 max-w-xl mx-auto text-sm sm:text-base font-light"
          >
            Track your journey through our two-phased cohort program. Connect, contribute, and build amazing products.
          </motion.p>
        </div>

        {/* Phase Switcher Tabs */}
        <div className="flex justify-center mb-16">
          <div className="relative flex p-1 bg-[#0c102b]/60 border border-white/[0.06] rounded-full backdrop-blur-md">
            <button
              onClick={() => setActivePhase("phase1")}
              className={`relative px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 z-10 flex items-center gap-2 ${
                isPhase1 ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Phase 1: Open Source
            </button>
            <button
              onClick={() => setActivePhase("phase2")}
              className={`relative px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 z-10 flex items-center gap-2 ${
                !isPhase1 ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Phase 2: Hackathon
            </button>

            {/* Glowing Active Slider background */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.25)] z-0"
              animate={{
                left: isPhase1 ? "4px" : "50%",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 ${lineGradient} md:-translate-x-1/2 opacity-20 transition-all duration-500`} />

          {/* Timeline Items */}
          <motion.div 
            key={activePhase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {events.map((event, index) => {
              const Icon = event.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Glowing Node Dot on Timeline */}
                  <div className={`absolute left-4 md:left-1/2 w-7 h-7 rounded-full bg-[#070b1e] border-2 ${borderNode} ${glowShadow} flex items-center justify-center -translate-x-1/2 z-20 transition-all duration-500`}>
                    <Icon className={`w-3.5 h-3.5 ${nodeIconText} transition-all duration-500`} />
                  </div>

                  {/* Left / Right Card Spacing */}
                  <div className={`w-full md:w-1/2 pl-12 ${
                    isEven ? "md:pl-10 md:pr-0" : "md:pl-0 md:pr-10"
                  }`}>
                    <div 
                      className={`group relative p-4 sm:p-5 rounded-xl border border-white/[0.05] bg-[#0c102b]/20 hover:bg-[#0c102b]/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${hoverBorder} shadow-lg ${
                        isEven ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      {/* Date Badge */}
                      <span className={`inline-block px-2.5 py-0.5 mb-2.5 text-xs font-semibold tracking-wider ${accentText} ${accentBg} border ${accentBorder} rounded-full transition-all duration-500`}>
                        {event.date}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors duration-200">
                        {event.title}
                      </h3>

                      {/* Event Subtitle / Notice */}
                      {event.subtitle && (
                        <p className={`text-xs font-mono font-medium tracking-wide mb-2 ${isPhase1 ? 'text-violet-400/90' : 'text-amber-400/90'}`}>
                          {event.subtitle}
                        </p>
                      )}

                      {/* Event Description */}
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {event.description}
                      </p>

                      {/* Accent highlight decoration */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${hoverGlowLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl`} />
                    </div>
                  </div>

                  {/* Spacer for MD screens to keep design balanced */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
