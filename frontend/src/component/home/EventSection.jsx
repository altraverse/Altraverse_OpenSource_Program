import { motion } from "motion/react";
import { 
  Compass, 
  GitPullRequest, 
  Trophy, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Code2,
  Sparkles
} from "lucide-react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function EventSection() {
  const steps = [
    {
      step: "01",
      icon: <Compass className="w-6 h-6 text-blue-400" />,
      title: "Register & Explore",
      subtitle: "DISCOVER PROJECTS",
      desc: "Sign up as a contributor, browse through participating organizations, and explore task difficulty tiers.",
      color: "blue",
      glow: "rgba(59, 130, 246, 0.12)",
      borderColor: "group-hover:border-blue-500/30",
      bulletPoints: [
        "Create developer profile",
        "Browse curated repositories",
        "Filter by language & tech"
      ]
    },
    {
      step: "02",
      icon: <Code2 className="w-6 h-6 text-violet-400" />,
      title: "Connect & Code",
      subtitle: "BUILD & COLLABORATE",
      desc: "Claim open issues, collaborate with repository mentors, and submit pull requests to build features.",
      color: "violet",
      glow: "rgba(139, 92, 246, 0.12)",
      borderColor: "group-hover:border-violet-500/30",
      bulletPoints: [
        "Claim matching issues",
        "Receive direct mentor guidance",
        "Submit validated pull requests"
      ]
    },
    {
      step: "03",
      icon: <Trophy className="w-6 h-6 text-rose-400" />,
      title: "Earn Swag & Prizes",
      subtitle: "REDEEM REWARDS",
      desc: "Get PRs merged, accumulate developer points, climb the leaderboard, and unlock developer goodies.",
      color: "rose",
      glow: "rgba(244, 63, 94, 0.12)",
      borderColor: "group-hover:border-rose-500/30",
      bulletPoints: [
        "Earn community points",
        "Win shirts, bags, & stickers",
        "Boost resume profile value"
      ]
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-16 bg-[#06091b] relative overflow-hidden">
      {/* Dynamic background mesh glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 80%)" }}
      />
      <div className="absolute inset-0 starfield pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-gradient-to-r from-violet-400 to-transparent" />
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
              Program Workflow
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-violet-400 to-transparent" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent mb-4"
          >
            Your Open Source Journey, Mapped Out
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed"
          >
            Three simple steps to build your developer portfolio, collaborate with maintainers, and secure exclusive swags.
          </motion.p>
        </div>

        {/* Steps Timeline Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative"
        >
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[1.5px] bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-rose-500/20 z-0 border-dashed border-t border-white/5" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant}
              whileHover={{ y: -6 }}
              className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-white/[0.04] bg-[#0c102b]/40 backdrop-blur-md transition-all duration-300 ${step.borderColor} hover:bg-[#0c102b]/70 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]`}
            >
              {/* Corner Radial Glow */}
              <div
                className="absolute top-0 right-0 w-[120px] h-[120px] pointer-events-none z-0 transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                style={{ background: `radial-gradient(circle at 90% 10%, ${step.glow} 0%, transparent 75%)` }}
              />

              {/* Watermark Step Number */}
              <div className="absolute bottom-6 right-6 font-display text-[72px] font-extrabold opacity-[0.015] group-hover:opacity-[0.04] transition-opacity duration-300 leading-none select-none z-0 text-white font-mono">
                {step.step}
              </div>

              <div className="relative z-10">
                {/* Icon Circle Wrapper */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    {step.icon}
                  </div>
                  
                  {/* Step counter tag */}
                  <span className="font-mono text-[9px] font-bold tracking-wider text-white/30 bg-white/[0.03] border border-white/[0.05] px-2.5 py-0.5 rounded-full uppercase">
                    {step.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white/90 mb-3 group-hover:text-white transition-colors duration-200">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/40 text-[13px] leading-relaxed font-light mb-6 group-hover:text-white/50 transition-colors duration-200">
                  {step.desc}
                </p>

                <hr className="border-white/[0.04] my-4" />

                {/* Inline checklist points */}
                <ul className="space-y-2.5">
                  {step.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start text-xs text-white/40 group-hover:text-white/50 transition-colors">
                      <ShieldCheck size={14} className="text-white/20 mr-2.5 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative connector arrow for mobile / visual cue */}
              {i < 2 && (
                <div className="lg:hidden flex justify-center py-4 text-white/10 group-hover:text-white/20 transition-colors">
                  <ArrowRight className="rotate-90 w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
