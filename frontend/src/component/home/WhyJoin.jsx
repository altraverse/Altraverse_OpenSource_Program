import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register the GSAP plugin for React safely
gsap.registerPlugin(useGSAP);

export default function WhyJoin() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // CARD 1
    const cells = gsap.utils.toArray(".contrib-cell");
    const shuffledCells = [...cells].sort(() => Math.random() - 0.5);
    const tl1 = gsap.timeline({ paused: true });

    tl1.to(shuffledCells, {
      fill: () => {
        const colors = ["#0e4429", "#006d32", "#26a641", "#39d353"];
        return colors[Math.floor(Math.random() * colors.length)];
      },
      opacity: 1,
      duration: 0.1,
      stagger: 0.01,
      ease: "power1.inOut",
    });

    // CARD 2
    const path = document.querySelector(".graph-path");
    const points = gsap.utils.toArray(".graph-point");
    const tl2 = gsap.timeline({ paused: true });

    if (path) {
      const pathLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.set(points, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      tl2
        .to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
        })
        .to(
          points,
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.8"
        );
    }

    // CARD 3
    const centerAvatar = document.querySelector(".avatar-center");
    const surroundingAvatars = gsap.utils.toArray(".avatar-surround");

    gsap.set(surroundingAvatars, {
      x: (i, el) => Number(el.dataset.x),
      y: (i, el) => Number(el.dataset.y),
      opacity: 0,
      scale: 0.5,
      transformOrigin: "center center",
    });

    const tl3 = gsap.timeline({ paused: true });

    tl3
      .to(centerAvatar, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(
        surroundingAvatars,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.4)",
        },
        "-=0.2"
      );

    // Hover events
    const cards = gsap.utils.toArray(".interactive-card");
    const handlers = [];

    cards.forEach((card) => {
      const cardId = card.dataset.cardId;

      const enter = () => {
        gsap.to(card, {
          y: -8,
          borderColor: "rgba(99, 102, 241, 0.4)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          duration: 0.3,
          ease: "power2.out",
        });

        if (cardId === "impact") tl1.restart();
        if (cardId === "grow") tl2.restart();
        if (cardId === "community") tl3.restart();
      };

      const leave = () => {
        gsap.to(card, {
          y: 0,
          borderColor: "rgba(51, 65, 85, 0.5)",
          backgroundColor: "rgba(30, 41, 59, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });

        if (cardId === "impact") tl1.reverse();
        if (cardId === "grow") tl2.reverse();
        if (cardId === "community") tl3.reverse();
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);

      handlers.push({ card, enter, leave });
    });

    return () => {
      handlers.forEach(({ card, enter, leave }) => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Why ASOC?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            A global platform empowering developers to contribute, collaborate,
            and thrive in the open-source ecosystem.
          </p>
        </div>

        {/* Cards Responsive Grid */}
        <div className="flex justify-around gap-6 flex-wrap auto-rows-fr w-full">

          {/* CARD 1: Real Impact */}
          <div
            data-card-id="impact"
            className="w-80 interactive-card relative border border-slate-800/50 rounded-2xl p-6 sm:p-8 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between transition-colors duration-300 shadow-xl"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Real Impact</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Work on meaningful open-source projects used by thousands of developers daily. Watch your contribution graph fill up.
              </p>
            </div>

            {/* GSAP Micro-interaction Graph Graphic */}
            <div className="w-full flex items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/30">
              <svg width="100%" height="105" viewBox="0 0 210 105" className="opacity-90 overflow-visible">
                <g fill="#161b22">
                  {Array.from({ length: 14 }).map((_, col) => (
                    Array.from({ length: 7 }).map((_, row) => (
                      <rect
                        key={`${col}-${row}`}
                        className="contrib-cell"
                        x={col * 15}
                        y={row * 15}
                        width="11"
                        height="11"
                        rx="2"
                        opacity="0.15"
                      />
                    ))
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* CARD 2: Learn And Grow */}
          <div
            data-card-id="grow"
            className="w-80 interactive-card relative border border-slate-800/50 rounded-2xl p-6 sm:p-8 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between transition-colors duration-300 shadow-xl"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Learn And Grow</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enhance your skills, collaborate with mentors, and keep your growth trajectory climbing upwards monotonically.
              </p>
            </div>

            {/* GSAP Micro-interaction SVG Line Graph */}
            <div className="w-full flex items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/30">
              <svg width="100%" height="105" viewBox="0 0 200 105" className="overflow-visible">
                <line x1="0" y1="90" x2="200" y2="90" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                <line x1="0" y1="55" x2="200" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

                <path
                  className="graph-path"
                  d="M 10 90 Q 40 75 70 50 T 130 40 T 190 15"
                  fill="none"
                  stroke="url(#gradientStroke)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <circle className="graph-point opacity-0 origin-center scale-0" cx="70" cy="50" r="4.5" fill="#6366f1" />
                <circle className="graph-point opacity-0 origin-center scale-0" cx="130" cy="40" r="4.5" fill="#3b82f6" />
                <circle className="graph-point opacity-0 origin-center scale-0" cx="190" cy="15" r="5.5" fill="#10b981" />

                <defs>
                  <linearGradient id="gradientStroke" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* CARD 3: Strong Community */}
          <div
            data-card-id="community"
            className="w-80 interactive-card relative border border-slate-800/50 rounded-2xl p-6 sm:p-8 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between transition-colors duration-300 shadow-xl"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Strong Community</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join a strong, distributed community of contributors and maintainers from all around the globe.
              </p>
            </div>

            {/* GSAP Micro-interaction Swarm Scene */}
            <div className="w-full flex items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/30">
              <svg width="100%" height="105" viewBox="0 0 140 105" className="overflow-visible">
                <circle className="avatar-surround opacity-0 origin-center scale-50" data-x="-35" data-y="-20" cx="35" cy="25" r="10" fill="#3b82f6" transform="translate(-35, -20)" />
                <circle className="avatar-surround opacity-0 origin-center scale-50" data-x="35" data-y="-15" cx="105" cy="30" r="9" fill="#ec4899" transform="translate(35, -15)" />
                <circle className="avatar-surround opacity-0 origin-center scale-50" data-x="-30" data-y="20" cx="40" cy="80" r="11" fill="#10b981" transform="translate(-30, 20)" />
                <circle className="avatar-surround opacity-0 origin-center scale-50" data-x="30" data-y="20" cx="100" cy="75" r="10" fill="#f59e0b" transform="translate(30, 20)" />

                <circle className="avatar-center origin-center" cx="70" cy="52" r="15" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M63 58 C63 54, 77 54, 77 58" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <circle cx="70" cy="49" r="3.5" fill="#ffffff" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
