import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Code2, Megaphone, Terminal, Handshake, Check } from "lucide-react";

const rolesData = [
  {
    role: "Contributor",
    badge: "Core Participant",
    icon: Code2,
    description: "The engine of the program. Solve issues, submit pull requests, work on real projects, and learn by doing.",
    colorTheme: "blue",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    borderClass: "group-hover:border-blue-500/40",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gradient: "from-blue-600/10 via-slate-900/40 to-slate-950/60",
    responsibilities: [
      "Find & claim open issues",
      "Submit high-quality PRs",
      "Collaborate with mentors"
    ],
    benefits: [
      "Official certificates & swag",
      "1-on-1 mentor guidance",
      "Leaderboard ranking"
    ],
    buttonText: "Explore Projects",
    buttonLink: "/projects",
    buttonStyle: "border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50"
  },
  {
    role: "Ambassador",
    badge: "Community Leader",
    icon: Megaphone,
    description: "Represent ASOC at your campus. Host meetups, spread open-source awareness, and onboard next-gen developers.",
    colorTheme: "rose",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
    borderClass: "group-hover:border-rose-500/40",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    gradient: "from-rose-600/10 via-slate-900/40 to-slate-950/60",
    responsibilities: [
      "Promote ASOC in your network",
      "Organize local hackathons",
      "Help resolve student queries"
    ],
    benefits: [
      "Exclusive Ambassador swags",
      "Direct program lead access",
      "Recommendation letters"
    ],
    buttonText: "Apply as Ambassador",
    buttonLink: "/become-mentor",
    buttonStyle: "border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/50"
  },
  {
    role: "Project Admin",
    badge: "Repository Owner",
    icon: Terminal,
    description: "Repository owners who manage their projects. Define project roadmaps, curate issues, and ensure code quality.",
    colorTheme: "purple",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    borderClass: "group-hover:border-purple-500/40",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gradient: "from-purple-600/10 via-slate-900/40 to-slate-950/60",
    responsibilities: [
      "Set codebase & guidelines",
      "Curate & tag issues",
      "Review & merge PRs"
    ],
    benefits: [
      "Scale project development",
      "Access a large talent pool",
      "Showcase project globally"
    ],
    buttonText: "Submit Your Project",
    buttonLink: "#",
    buttonStyle: "border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
  },
  {
    role: "Partner / Sponsor",
    badge: "Strategic Sponsor",
    icon: Handshake,
    description: "Organisations supporting the initiative. Fund rewards, sponsor infrastructure, and offer internship opportunities.",
    colorTheme: "amber",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    borderClass: "group-hover:border-amber-500/40",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    gradient: "from-amber-600/10 via-slate-900/40 to-slate-950/60",
    responsibilities: [
      "Fund program rewards",
      "Provide cloud resources",
      "Review custom tracks"
    ],
    benefits: [
      "Brand visibility in cohort",
      "Scout top developer resumes",
      "Collaborate on dev relations"
    ],
    buttonText: "Sponsor Program",
    buttonLink: "mailto:sponsor@asoc.org",
    buttonStyle: "border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/50"
  }
];

export default function Roles() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-16 bg-brand1 border-b border-white/5 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-3 inline-block"
          >
            Roles & Participation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-slate-400"
          >
            Find Your Place in ASOC
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Whether you want to build features, advocate for campus growth, maintain projects, or fund rewards, there is a dedicated track for you.
          </motion.p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {rolesData.map((roleInfo, index) => {
            const Icon = roleInfo.icon;
            return (
              <motion.div
                key={roleInfo.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-white/5 bg-gradient-to-b ${roleInfo.gradient} backdrop-blur-md transition-all duration-300 ${roleInfo.borderClass} ${roleInfo.glowClass} shadow-xl h-full`}
              >
                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${roleInfo.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-medium tracking-wide border rounded-full ${roleInfo.badgeBg}`}>
                      {roleInfo.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                    {roleInfo.role}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    {roleInfo.description}
                  </p>

                  <hr className="border-white/5 my-4" />

                  {/* Responsibilities list */}
                  <div className="space-y-2.5 mb-5">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Responsibilities</h4>
                    <ul className="space-y-2">
                      {roleInfo.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-400">
                          <Check className="w-3.5 h-3.5 text-indigo-400/80 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="border-white/5 my-4" />

                  {/* Perks/Benefits list */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Perks & Benefits</h4>
                    <ul className="space-y-2">
                      {roleInfo.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-400/80 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dedicated Action Button */}
                <div className="mt-8 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      if (roleInfo.buttonLink.startsWith('mailto:')) {
                        window.location.href = roleInfo.buttonLink;
                      } else if (roleInfo.buttonLink !== "#") {
                        navigate(roleInfo.buttonLink);
                      }
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-center transition-all border duration-300 ${roleInfo.buttonStyle} cursor-pointer`}
                  >
                    {roleInfo.buttonText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
