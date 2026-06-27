import { motion } from "motion/react";
import { Calendar, CheckCircle2, Code, FileInput, Award, ShieldAlert } from "lucide-react";

const timelineEvents = [
  {
    date: "Oct 1, 2026",
    title: "Contributor Registration Opens",
    description: "Browse the participating open-source projects, talk to mentors, and submit your registration application.",
    icon: FileInput,
  },
  {
    date: "Oct 20, 2026",
    title: "Contributor Registration Closes",
    description: "Final deadline to register as a contributor. Make sure all your details are up to date.",
    icon: ShieldAlert,
  },
  {
    date: "Oct 25, 2026",
    title: "Contribution Period Starts",
    description: "Coding begins! Claim issues, submit pull requests, and start collaborating with project maintainers.",
    icon: Code,
  },
  {
    date: "Nov 30, 2026",
    title: "Mid-Term Review",
    description: "Mentors review early progress and contributions. Feedback is provided to keep everyone on track.",
    icon: Calendar,
  },
  {
    date: "Dec 20, 2026",
    title: "Contribution Period Ends",
    description: "Code freeze. Final evaluations start. Make sure all your PRs are merged or submitted for review.",
    icon: CheckCircle2,
  },
  {
    date: "Dec 30, 2026",
    title: "Results & Certificates",
    description: "Celebrate your success! Final results are announced, and certificates, badges, and swags are sent out.",
    icon: Award,
  },
];

export default function Timeline() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden border-b border-white/5">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 tracking-tight"
          >
            Program Timeline
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base"
          >
            Key dates and milestones for the Altraverse Open Source Program cohort.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-emerald-500 md:-translate-x-1/2 opacity-30" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
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
                  <div className="absolute left-4 md:left-1/2 w-7 h-7 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)] flex items-center justify-center -translate-x-1/2 z-20">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                  </div>

                  {/* Left / Right Card Spacing */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-6">
                    <div 
                      className={`group relative p-4 sm:p-5 rounded-xl border border-slate-800/60 bg-slate-900/20 hover:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/40 shadow-lg ${
                        isEven ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      {/* Date Badge */}
                      <span className="inline-block px-2.5 py-0.5 mb-2.5 text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        {event.date}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors duration-200">
                        {event.title}
                      </h3>

                      {/* Event Description */}
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {event.description}
                      </p>

                      {/* Accent highlight decoration */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
                    </div>
                  </div>

                  {/* Spacer for MD screens to keep design balanced */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
