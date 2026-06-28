import { motion } from "motion/react";

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative z-20 mt-12 w-full max-w-5xl mx-auto border border-blue-700/50 rounded-2xl bg-brand1/60 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-6 p-8"
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="textGradient text-4xl font-black">50K+</span>
        <span className="text-slate-400 font-medium">Contributors</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="textGradient text-4xl font-black">500K+</span>
        <span className="text-slate-400 font-medium">Pull Requests</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="textGradient text-4xl font-black">1K+</span>
        <span className="text-slate-400 font-medium">Projects</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="textGradient text-4xl font-black">5M+</span>
        <span className="text-slate-400 font-medium">Lines of Code</span>
      </div>
    </motion.div>
  );
}
