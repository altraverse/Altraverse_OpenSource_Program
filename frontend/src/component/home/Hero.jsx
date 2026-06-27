import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GitBranch, Terminal, Award, GitPullRequest, Flame } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS.load('hero', '/partical.json', function () {
        console.log('callback - particles.js config loaded');
      });
    }

    function createShootingStar() {
      const container = document.querySelector('.starContainer');
      if (!container) return;

      const radians = Math.atan(Math.min(window.innerHeight, window.innerWidth) / Math.max(window.innerWidth, window.innerHeight) * 2);
      const deg = radians * (180 / Math.PI);
      const animationName = `fly-diagonal-${Math.floor(Math.random() * 100000)}`;

      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @keyframes ${animationName} {
          0% {
            transform: rotate(${deg}deg) translateX(0) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: rotate(${deg}deg) translateX(120vw) ;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      const star = document.createElement('div');
      star.className = 'shooting-star';

      const startTop = Math.random() * 60;
      const startLeft = -(Math.random() * 10 + 5);
      const duration = Math.random() * 1 + 1.5;

      Object.assign(star.style, {
        top: `${startTop}%`,
        left: `${startLeft}%`,
        animation: `${animationName} ${duration}s linear forwards`
      });

      container.appendChild(star);

      star.addEventListener('animationend', () => {
        star.remove();
        styleSheet.remove();
      });
    }

    function spawnLoop() {
      createShootingStar();
      const nextDelay = Math.random() * 10000 + 1000;
      setTimeout(spawnLoop, nextDelay);
    }

    spawnLoop();
  }, []);

  return (
    <div id='hero' className='relative bg-[#06091b] min-h-screen w-full overflow-hidden hero2-replaced'>
      {/* Background theme matched exactly with Announcement Hero page */}
      <div className="absolute inset-0 bg-cosmic-hero pointer-events-none" />
      <div className="absolute inset-0 starfield pointer-events-none" />

      {/* Atmospheric glows from Announcement Hero */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 60% 50% at 25% 40%, rgba(91,63,214,0.30) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 40% 50% at 80% 20%, rgba(34,211,168,0.10) 0%, transparent 65%)" }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 30% 40% at 90% 70%, rgba(129,140,248,0.08) 0%, transparent 60%)" }} />

      {/* Crescent Moon from Announcement Hero */}
      <div className="absolute moon-crescent rounded-full"
           style={{ top: 88, right: 80, width: 58, height: 58 }} />

      {/* Star container for dynamic shooting stars */}
      <div className="absolute inset-0 z-2 overflow-hidden starContainer"></div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full pb-20">
        
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
            <Button onClick={() => navigate('/projects')} className="buttonGradient py-6 px-8 rounded-full font-semibold text-sm w-full sm:w-auto shadow-[0_4px_24px_rgba(99,102,241,0.3)] cursor-pointer">
              Explore Projects
            </Button>
            <Button 
              onClick={() => window.open('https://discord.gg', '_blank')} 
              variant="ghost" 
              className="border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-white py-6 px-8 rounded-full font-semibold text-sm w-full sm:w-auto flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z" />
              </svg>
              Join Community
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Unique 3D Floating Developer Universe Mockup (5 cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative w-full h-[450px] mt-10 lg:mt-0 select-none z-10">
          
          {/* Orbital background grid lines */}
          <div className="absolute w-80 h-80 rounded-full border border-dashed border-white/[0.03] animate-[spin_40s_linear_infinite] z-0" />
          <div className="absolute w-[440px] h-[440px] rounded-full border border-white/[0.02] animate-[spin_60s_linear_infinite_reverse] z-0" />
          
          {/* Ambient Center Glow */}
          <div className="absolute w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl z-0" />

          {/* Central Logo Core (Z-Index 10) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-[#0d102b] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.25)] flex flex-col justify-center items-center z-10"
          >
            <span className="text-sm font-black tracking-widest text-white font-display">ASOC</span>
            <span className="text-[7px] font-mono tracking-[0.25em] text-indigo-400 font-bold mt-1">CORE</span>
          </motion.div>

          {/* Floating Element 1: 3D GitHub Contribution Grid Card (Top-Left) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute top-4 left-0 z-20"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 shadow-2xl w-[190px]"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <Flame size={12} className="text-emerald-400 animate-pulse" />
                <span className="font-mono text-[8px] tracking-wider text-white/50 uppercase">Contribution Graph</span>
              </div>
              
              {/* Grid representation */}
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {[
                  "bg-emerald-500/20", "bg-emerald-400/80", "bg-emerald-500/10", "bg-emerald-500/40", "bg-emerald-500/10", "bg-emerald-400/70", "bg-emerald-300",
                  "bg-emerald-500/10", "bg-emerald-500/20", "bg-emerald-500/60", "bg-emerald-500/10", "bg-emerald-300", "bg-emerald-500/20", "bg-emerald-500/10",
                  "bg-emerald-400/80", "bg-emerald-500/10", "bg-emerald-500/10", "bg-emerald-500/40", "bg-emerald-500/10", "bg-emerald-500/10", "bg-emerald-400/90",
                  "bg-emerald-500/10", "bg-emerald-300", "bg-emerald-500/20", "bg-emerald-500/10", "bg-emerald-500/60", "bg-emerald-500/20", "bg-emerald-500/10"
                ].map((opacityClass, idx) => (
                  <div key={idx} className={`w-3.5 h-3.5 rounded-sm ${opacityClass} transition-colors duration-300 hover:bg-emerald-400`} />
                ))}
              </div>
              <div className="font-mono text-[8px] text-emerald-400 flex justify-between items-center mt-1">
                <span>+42 commits</span>
                <span className="text-[7px] text-white/30">this month</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 2: PR Merged Card (Middle-Right) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute top-20 right-0 z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 shadow-2xl w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <GitPullRequest size={13} className="text-purple-400" />
                  <span className="font-mono text-[8px] text-purple-400 font-bold tracking-wider uppercase">PR #1204</span>
                </div>
                <span className="font-mono text-[7px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">Merged</span>
              </div>
              <div className="font-body text-[10px] text-white/80 font-medium mb-1.5 truncate">
                feat: add dark mode theme option
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 mt-2">
                <span className="font-mono text-[8px] text-white/30">Merged by @lead_mentor</span>
                <span className="font-mono text-[8px] text-emerald-400 font-bold">+150 PTS</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 3: Contributor Leaderboard Card (Bottom-Left) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute bottom-6 left-2 z-20"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.2 }}
              className="bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 w-[180px]"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Award size={18} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40">LEADERBOARD</div>
                <div className="text-xs font-bold text-white">#12 Rank (Gold)</div>
                <div className="text-[9px] text-emerald-400 font-mono font-bold">450 points</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 4: Active Code Branch Badge (Bottom-Right) */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-10 right-4 z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.7 }}
              className="bg-[#090b1c]/80 border border-white/[0.08] backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 w-[190px]"
            >
              <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <GitBranch size={16} className="text-violet-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40">ACTIVE STREAM</div>
                <div className="text-xs font-bold text-white">main ← dev-theme</div>
                <div className="text-[8px] font-mono text-white/30">Updated 2m ago</div>
              </div>
            </motion.div>
          </motion.div>

        </div>

      </div>

      {/* Silhouette vector landscape from Announcement Hero */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none overflow-hidden" style={{ height: 130 }}>
        <svg viewBox="0 0 1440 130" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="none"
             className="absolute bottom-0 left-0 w-full h-full block">
          {/* Back hills */}
          <path d="M0 130 Q220 30 440 80 Q660 128 880 42 Q1060 -8 1240 58 Q1360 100 1440 48 L1440 130 Z"
                fill="#0d1640"/>
          {/* Mid hills */}
          <path d="M0 130 Q160 78 320 104 Q520 130 720 68 Q900 28 1100 90 Q1260 130 1440 72 L1440 130 Z"
                fill="#0a1232"/>
          {/* Front ground */}
          <path d="M0 130 Q120 110 240 122 Q420 136 580 104 Q720 82 880 116 Q1040 138 1200 98 Q1340 72 1440 100 L1440 130 Z"
                fill="#06091b"/>

          {/* Left palm cluster */}
          <rect x="205" y="54" width="6"  height="68" fill="#0a1232"/>
          <path d="M197 54 Q208 28 219 54 Z" fill="#0a1232"/>
          <rect x="232" y="70" width="4"  height="54" fill="#0a1232"/>
          <path d="M225 70 Q234 52 243 70 Z" fill="#0a1232"/>
          <rect x="182" y="68" width="4"  height="58" fill="#0a1232"/>
          <path d="M175 68 Q184 50 193 68 Z" fill="#0a1232"/>

          {/* Right palm cluster */}
          <rect x="1218" y="34" width="7"  height="80" fill="#0d1640"/>
          <path d="M1208 34 Q1221 6 1234 34 Z" fill="#0d1640"/>
          <rect x="1250" y="55" width="5"  height="60" fill="#0d1640"/>
          <path d="M1243 55 Q1252 34 1261 55 Z" fill="#0d1640"/>
          <rect x="1192" y="50" width="4"  height="64" fill="#0d1640"/>
          <path d="M1186 50 Q1194 30 1202 50 Z" fill="#0d1640"/>

          {/* Grass tufts */}
          <path d="M48 128 Q52 116 56 128 M58 126 Q61 118 64 126" stroke="#0a1232" strokeWidth="2" fill="none"/>
          <path d="M1390 122 Q1394 112 1398 122" stroke="#0d1640" strokeWidth="2" fill="none"/>
        </svg>
      </div>
    </div>
  );
}
