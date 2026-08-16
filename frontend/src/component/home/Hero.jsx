import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GitBranch, Award, GitPullRequest } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // useEffect(() => {
  //
  //   window.particlesJS.load('hero', '/partical.json', function() {
  //     console.log('callback - particles.js config loaded');
  //   });
  //
  //   function createShootingStar() {
  //     const container = document.querySelector('.starContainer');
  //     if (!container) return;
  //
  //     // 1. Calculate the exact angle based on viewport
  //     const radians = Math.atan(Math.min(window.innerHeight, window.innerWidth) / Math.max(window.innerWidth, window.innerHeight) * 2);
  //     const deg = radians * (180 / Math.PI);
  //
  //     // 2. Generate a unique name for this star's custom animation path
  //     const animationName = `fly-diagonal-${Math.floor(Math.random() * 100000)}`;
  //
  //     // 3. Create the CSS keyframes string inject dynamically
  //     // This bakes your calculated 'deg' directly into the transform steps
  //     const styleSheet = document.createElement("style");
  //     styleSheet.textContent = `
  //   @keyframes ${animationName} {
  //     0% {
  //       transform: rotate(${deg}deg) translateX(0) translateY(0);
  //       opacity: 0;
  //     }
  //     10% {
  //       opacity: 1;
  //     }
  //     90% {
  //       opacity: 1;
  //     }
  //     100% {
  //       transform: rotate(${deg}deg) translateX(120vw) ;
  //       opacity: 0;
  //     }
  //   }
  // `;
  //     document.head.appendChild(styleSheet);
  //
  //     // 4. Create and configure the star element
  //     const star = document.createElement('div');
  //     star.className = 'shooting-star';
  //
  //     const startTop = Math.random() * 60;
  //     const startLeft = -(Math.random() * 10 + 5);
  //     const duration = Math.random() * 1 + 1.5; // Between 1.5s and 2.5s
  //
  //     Object.assign(star.style, {
  //       top: `${startTop}%`,
  //       left: `${startLeft}%`,
  //       // Use the unique animation name we just injected above
  //       animation: `${animationName} ${duration}s linear forwards`
  //     });
  //
  //     container.appendChild(star);
  //
  //     // 5. Clean up BOTH the star and its custom style tag when done
  //     star.addEventListener('animationend', () => {
  //       star.remove();
  //       styleSheet.remove();
  //     });
  //   }
  //   // 2. Fix: Use a recursive setTimeout loop for truly dynamic random intervals
  //   function spawnLoop() {
  //     createShootingStar();
  //
  //     // Generates a random delay between 1 and 11 seconds (based on your original Math.random() * 10000 + 1000)
  //     const nextDelay = Math.random() * 10000 + 1000;
  //
  //     setTimeout(spawnLoop, nextDelay);
  //   }
  //
  //   // Start the loop
  //   spawnLoop();
  //   // every 1 - 1.5 seconds
  //   // setInterval(() => {
  //   //   createShootingStar();
  //   // }, Math.random() * 10000 + 1000);
  //
  //
  // }, []);


  //   return (
  //     <div id='hero' className=' bg-black h-screen w-full hero overflow-hidden relative'>
  // =======

  return (
    <div id='hero' className='relative bg-[#06091b] min-h-screen w-full overflow-hidden hero2-replaced'>
      {/* Background theme matched exactly with Announcement Hero page */}
      <div className="absolute inset-0 bg-cosmic-hero pointer-events-none" />

      {/* Atmospheric glows from Announcement Hero */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 25% 40%, rgba(91,63,214,0.30) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 50% at 80% 20%, rgba(34,211,168,0.10) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 30% 40% at 90% 70%, rgba(129,140,248,0.08) 0%, transparent 60%)" }} />

      {/* Crescent Moon from Announcement Hero */}
      <div className="hidden sm:block absolute moon-crescent rounded-full mt-5 "
        style={{ top: 88, right: 80, width: 58, height: 58 }} />

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full pt-36 sm:pt-40 lg:pt-32 pb-20">

        {/* Left Column: Typography & CTAs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-2"
          >
            <div className="h-px w-8 bg-gradient-to-r from-violet-400 to-transparent" />
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
              India's Premier Open Source Cohort
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-[clamp(36px,5.2vw,60px)] font-extrabold leading-[1.1] text-white tracking-tight"
          >
            Code. Contribute.
            <br />
            <span className="gradient-text">Create Global Impact.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-[15px] sm:text-[16px] leading-[1.8] text-white/50 max-w-[540px] font-light"
          >
            ASOC connects developers of all skill levels with friendly open source projects. Solve real issues, collaborate with global maintainers, and build your developer portfolio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto"
          >
            {!user ? (
              <>
                {/* Mobile only Login button */}
                <Button onClick={() => navigate('/login')} className="flex items-center justify-center sm:hidden buttonGradient py-6 px-8 rounded-full font-semibold text-sm w-full shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center">
                  Login
                </Button>
                {/* Desktop/Tablet only Explore Projects button */}
                <Button onClick={() => navigate('/projects')} className="hidden sm:flex items-center justify-center buttonGradient py-6 px-8 rounded-full font-semibold text-sm w-auto shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  Explore Projects
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/projects')} className="flex items-center justify-center buttonGradient py-6 px-8 rounded-full font-semibold text-sm w-full sm:w-auto shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                Explore Projects
              </Button>
            )}
            <Button
              onClick={() => window.open('https://chat.whatsapp.com/K9YQAz1PxAyDnB2Kw4lteJ?s=cl&p=a&mlu=0', '_blank')}
              variant="ghost"
              className="border border-white/10 hover:border-white/20 hover:bg-white text-white py-6 px-8 rounded-full font-semibold text-sm w-full sm:w-auto flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.479 1.332 5.006l-1.354 4.954 5.074-1.331c1.472.802 3.125 1.223 4.819 1.225h.004c5.505 0 9.987-4.482 9.987-9.988 0-2.668-1.039-5.176-2.927-7.065-1.888-1.887-4.397-2.926-7.065-2.926zm5.823 13.064c-.242.684-1.201 1.25-1.656 1.298-.444.047-.872.247-2.884-.551-2.011-.798-3.303-2.842-3.403-2.975-.1-.134-.814-1.084-.814-2.068 0-.983.513-1.467.697-1.668.184-.2.4-.25.534-.25h.384c.125 0 .292-.047.459.359.167.406.571 1.391.621 1.492.05.101.083.219.017.352-.067.133-.1.219-.2.336-.1.117-.21.261-.3.35-.1.101-.205.21-.089.41.117.2.52 1.012.92 1.368.513.456.953.597 1.087.664.134.067.21.05.292-.046.082-.097.352-.41.444-.551.092-.142.184-.117.31-.071l1.272.597c.125.067.208.101.242.158.033.058.033.336-.075.687z" />
              </svg>
              Join Community
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Premium Cyber-Constellation Orbit Visual (5 cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative w-full h-[450px] select-none z-10">

          {/* Orbital background grid lines */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-white/[0.02] animate-[spin_60s_linear_infinite_reverse] z-0" />

          {/* Ambient Glow behind planet */}
          <div className="absolute w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl z-0" />

          {/* The Floating Constellation Planet Container */}
          <img src="output.png" alt="man" className="h-100 md:h-140 absolute z-0 -bottom-20 md:-bottom-40" />

          {/* Floating Skill Badges escaping from the rocket / orbiting */}
          {/* Badge 1: Git (Top-Right) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="absolute top-12 right-6 bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="font-mono text-[9px] text-white/80 font-bold uppercase tracking-wider">Git</span>
          </motion.div>

          {/* Badge 2: Code (Bottom-Left) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-16 left-6 bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-[9px] text-white/80 font-bold uppercase tracking-wider">React</span>
          </motion.div>

          {/* Badge 3: Launch Mission Stats (Middle-Left) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.6 }}
            className="absolute top-18 left-4 bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-[170px]"
          >
            <div className="w-7.5 h-7.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Award size={14} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-[8px] font-mono text-white/40">MISSION STATUS</div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Ready to Launch</div>
            </div>
          </motion.div>

          {/* Badge 4: Live Merges (Bottom-Right) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 0.9 }}
            className="absolute bottom-12 right-4 bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-2.5 w-[160px]"
          >
            <GitPullRequest size={13} className="text-emerald-400" />
            <div>
              <div className="text-[8px] font-mono text-white/40">PR SUCCESS RATE</div>
              <div className="text-[10px] font-bold text-emerald-400">100% Merged</div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Silhouette vector landscape from Announcement Hero */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none overflow-hidden" style={{ height: 130 }}>
        <svg viewBox="0 0 1440 130" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full block">
          {/* Back hills */}
          <path d="M0 130 Q220 30 440 80 Q660 128 880 42 Q1060 -8 1240 58 Q1360 100 1440 48 L1440 130 Z"
            fill="#0d1640" />
          {/* Mid hills */}
          <path d="M0 130 Q160 78 320 104 Q520 130 720 68 Q900 28 1100 90 Q1260 130 1440 72 L1440 130 Z"
            fill="#0a1232" />
          {/* Front ground */}
          <path d="M0 130 Q120 110 240 122 Q420 136 580 104 Q720 82 880 116 Q1040 138 1200 98 Q1340 72 1440 100 L1440 130 Z"
            fill="#06091b" />

          {/* Left palm cluster */}
          <rect x="205" y="54" width="6" height="68" fill="#0a1232" />
          <path d="M197 54 Q208 28 219 54 Z" fill="#0a1232" />
          <rect x="232" y="70" width="4" height="54" fill="#0a1232" />
          <path d="M225 70 Q234 52 243 70 Z" fill="#0a1232" />
          <rect x="182" y="68" width="4" height="58" fill="#0a1232" />
          <path d="M175 68 Q184 50 193 68 Z" fill="#0a1232" />

          {/* Right palm cluster */}
          <rect x="1218" y="34" width="7" height="80" fill="#0d1640" />
          <path d="M1208 34 Q1221 6 1234 34 Z" fill="#0d1640" />
          <rect x="1250" y="55" width="5" height="60" fill="#0d1640" />
          <path d="M1243 55 Q1252 34 1261 55 Z" fill="#0d1640" />
          <rect x="1192" y="50" width="4" height="64" fill="#0d1640" />
          <path d="M1186 50 Q1194 30 1202 50 Z" fill="#0d1640" />

          {/* Grass tufts */}
          <path d="M48 128 Q52 116 56 128 M58 126 Q61 118 64 126" stroke="#0a1232" strokeWidth="2" fill="none" />
          <path d="M1390 122 Q1394 112 1398 122" stroke="#0d1640" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
}
