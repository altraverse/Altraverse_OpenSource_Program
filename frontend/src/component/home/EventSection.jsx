import { motion } from "motion/react";
import { CheckCircle2, Users, Trophy } from "lucide-react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function EventSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16 bg-brand1 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 textGradient">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Your journey into open source, simplified.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <CheckCircle2 className="w-8 h-8 text-blue-400" />,
              title: "1. Register & Explore",
              desc: "Sign up as a contributor and browse through hundreds of curated open-source projects.",
            },
            {
              icon: <Users className="w-8 h-8 text-purple-400" />,
              title: "2. Connect & Code",
              desc: "Claim issues, interact with maintainers, and submit your pull requests.",
            },
            {
              icon: <Trophy className="w-8 h-8 text-pink-400" />,
              title: "3. Win Swag & Prizes",
              desc: "Climb the leaderboard, build your portfolio, and earn exclusive ASOC merchandise.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant}
              className="bg-brand2 p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10  group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="mb-6 bg-brand1 w-16 h-16 rounded-xl flex items-center justify-center border border-white/5 relative z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">
                {step.title}
              </h3>
              <p className="text-slate-400 relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
