import { motion } from "motion/react";
import { Users2, GitPullRequest, FolderGit2, Terminal } from "lucide-react";

export default function Stats() {
  const statsData = [
    {
      value: "50K+",
      label: "Contributors",
      icon: Users2,
      color: "from-amber-400 to-orange-500",
      shadow: "shadow-orange-500/10",
      glow: "rgba(249, 115, 22, 0.12)"
    },
    {
      value: "500K+",
      label: "Pull Requests",
      icon: GitPullRequest,
      color: "from-indigo-400 to-purple-600",
      shadow: "shadow-indigo-500/10",
      glow: "rgba(99, 102, 241, 0.12)"
    },
    {
      value: "1K+",
      label: "Projects Listed",
      icon: FolderGit2,
      color: "from-pink-400 to-rose-600",
      shadow: "shadow-pink-500/10",
      glow: "rgba(244, 63, 94, 0.12)"
    },
    {
      value: "5M+",
      label: "Lines of Code",
      icon: Terminal,
      color: "from-emerald-400 to-teal-600",
      shadow: "shadow-emerald-500/10",
      glow: "rgba(16, 185, 129, 0.12)"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="relative z-20 mt-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative bg-[#0c102b]/40 border border-white/[0.06] backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 ${stat.shadow}`}
            style={{
              boxShadow: `0 10px 30px -10px ${stat.glow}`
            }}
          >
            {/* Ambient Background Glow inside card */}
            <div 
              className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)` }}
            />

            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white`}>
                <Icon size={20} className="stroke-[2px]" />
              </div>
              <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">METRIC_0{index + 1}</span>
            </div>

            <div>
              <span className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-display tracking-tight block mb-1`}>
                {stat.value}
              </span>
              <span className="text-slate-400/90 font-medium text-xs tracking-wider uppercase font-mono">
                {stat.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
