import React, { useEffect, useRef } from "react";

import team1 from "../assets/team/team1.png";
import team2 from "../assets/team/team2.png";
import team3 from "../assets/team/team3.png";
import team4 from "../assets/team/team4.png";
import team5 from "../assets/team/team5.png";
import team6 from "../assets/team/team6.png";
import team7 from "../assets/team/team7.png";
import team8 from "../assets/team/team8.png";

/* ═══════════════════════════════════════════════════════════════════════
   TEAM DATA
   ═══════════════════════════════════════════════════════════════════════ */
const TEAM = [
    { img: team1, name: "Aryan Sharma", role: "Founder" },
    { img: team2, name: "Priya Mehta", role: "Co-Founder" },
    { img: team3, name: "Sneha Patel", role: "Tech Lead" },
    { img: team4, name: "Rohan Das", role: "Community Manager" },
    { img: team5, name: "Vikram Nair", role: "Design Lead" },
    { img: team6, name: "Aditya Kumar", role: "Backend Engineer" },
    { img: team7, name: "Meera Singh", role: "Frontend Dev" },
    { img: team8, name: "Karan Joshi", role: "DevOps Engineer" },
];

const N_TEAM = TEAM.length; // 8

/*
  ARCHITECTURE — Virtual Linear Track
  ─────────────────────────────────────
  We maintain a continuous real-number offset `trackPos` (in px) that
  grows every frame. Each DOM node is assigned a fixed "slot index" i
  (0…SLOTS-1). Its logical track position is:

      slotX = i * SPACING - trackPos

  When slotX falls below LEFT_RECYCLE we teleport it by adding TOTAL_WIDTH,
  which is always off-screen at that moment (it just exited the left edge).

  This is the approach used by production infinite carousels (Apple, Stripe):
  - No phase wrapping
  - No ring maths
  - No per-card identity confusion
  - Teleport happens when the card is guaranteed invisible (opacity 0)
*/

/* ═══════════════════════════════════════════════════════════════════════
   LAYOUT CONSTANTS  (px, in screen space)
   ═══════════════════════════════════════════════════════════════════════ */
const CARD_W = 200;   // card width in px (matches JSX below)
const SPACING = 200;   // centre-to-centre distance between slots (px)
const SLOTS = N_TEAM * 4; // 32 DOM nodes — enough to fill any viewport
const TOTAL_W = SLOTS * SPACING;

/* ═══════════════════════════════════════════════════════════════════════
   VISUAL CONFIG
   ═══════════════════════════════════════════════════════════════════════ */
const CFG = {
    speed: 60,    // px / second (constant)
    curveDepth: 10,    // px of vertical drop per SPACING² away from center
    rotPerPx: 4 / SPACING, // deg per px of horizontal offset from center

    centerScale: 1.18,
    edgeScale: 0.86,

    // Visual fade zones — in px from the horizontal center of the viewport
    // These are VIEWPORT-relative so they never depend on SPACING or SLOTS.
    fadeStartPx: SPACING * 2.8,  // fully opaque inside this range
    fadeEndPx: SPACING * 4.2,  // fully transparent beyond this
    hidePx: SPACING * 5.0,  // visibility:hidden beyond this (recycle safety)

    maxBlur: 7,     // px
};

/* ═══════════════════════════════════════════════════════════════════════
   COLOURS
   ═══════════════════════════════════════════════════════════════════════ */
const T = {
    bg: "#0B0F19",
    card: "#111827",
    border: "rgba(255,255,255,0.08)",
    textPri: "#F1F5F9",
    textSec: "#94A3B8",
    textMute: "#64748B",
};

/* ═══════════════════════════════════════════════════════════════════════
   STATIC CSS  (hover only — animation is 100% rAF-driven)
   ═══════════════════════════════════════════════════════════════════════ */
const CAROUSEL_CSS = `
  .mtc-card {
    transition: box-shadow 220ms ease, border-color 220ms ease;
    cursor: default;
  }
  .mtc-card:hover {
    box-shadow: 0 30px 70px rgba(0,0,0,0.5);
    border-color: rgba(255,255,255,0.15);
  }
  @media (max-width: 1024px) {
    .mtc-carousel { height: 380px !important; }
    .mtc-card     { width: 170px !important; }
  }
  @media (max-width: 640px) {
    .mtc-carousel { height: 340px !important; }
    .mtc-card     { width: 140px !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   SMOOTHSTEP  (visual properties only — position is always linear)
   ═══════════════════════════════════════════════════════════════════════ */
function smoothstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function MeetTeamHero() {
    // slotOffset[i] stores the current teleport-adjusted track offset for slot i.
    // We initialise so that slots are spread evenly and centred around 0.
    const slotOffset = useRef(
        Array.from({ length: SLOTS }, (_, i) => i * SPACING - (SLOTS / 2) * SPACING)
    );
    const cardEls = useRef([]);
    const trackPos = useRef(0);
    const pausedRef = useRef(false);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);

    // We need to know the half-width of the container to compute screen-space x.
    // We read it from the DOM once and cache it; it only matters for the recycle
    // threshold (LEFT_RECYCLE) which is off-screen anyway.
    const containerW = useRef(typeof window !== "undefined" ? window.innerWidth : 1440);

    useEffect(() => {
        const onResize = () => { containerW.current = window.innerWidth; };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const {
            speed, curveDepth, rotPerPx,
            centerScale, edgeScale,
            fadeStartPx, fadeEndPx, hidePx,
            maxBlur,
        } = CFG;

        const scaleDelta = centerScale - edgeScale;
        const fadeWidth = fadeEndPx - fadeStartPx;

        // Recycle boundary: a slot's screen-x must be less than this to be recycled.
        // We add CARD_W/2 so the full card width has left the screen before teleport.
        // LEFT_RECYCLE is negative (far left off-screen).
        const LEFT_RECYCLE_HALF = -containerW.current / 2 - CARD_W;

        const tick = (ts) => {
            if (lastTimeRef.current == null) lastTimeRef.current = ts;
            const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.05);
            lastTimeRef.current = ts;

            if (!pausedRef.current) {
                trackPos.current += speed * dt;
            }

            const tp = trackPos.current;
            // Dynamically use the actual container width for recycle threshold
            const leftRecycle = -containerW.current / 2 - CARD_W;

            for (let i = 0; i < SLOTS; i++) {
                const el = cardEls.current[i];
                if (!el) continue;

                // Screen-space x: distance from the horizontal centre of the viewport.
                // Positive = right of centre, negative = left of centre.
                let sx = slotOffset.current[i] - tp;

                // ─── Recycle ──────────────────────────────────────────────────
                // When a slot has moved fully off the LEFT side, teleport it to
                // the RIGHT side of the track. At that moment its screen-x is
                // beyond leftRecycle, meaning opacity is already 0 — invisible.
                if (sx < leftRecycle) {
                    slotOffset.current[i] += TOTAL_W;
                    sx += TOTAL_W;
                }

                // ─── Visibility culling ───────────────────────────────────────
                const absSx = Math.abs(sx);
                if (absSx > hidePx) {
                    el.style.visibility = "hidden";
                    continue;
                }
                el.style.visibility = "visible";

                // ─── Arc path (position is always linear — no easing on x/y) ─
                const y = (sx / SPACING) * (sx / SPACING) * curveDepth;
                const r = Math.max(-16, Math.min(16, sx * rotPerPx));

                // ─── Scale ────────────────────────────────────────────────────
                // Linear from centerScale → edgeScale across [0, fadeStartPx].
                const normScale = Math.min(absSx, fadeStartPx) / fadeStartPx;
                const s = centerScale - normScale * scaleDelta;

                // ─── Opacity & Blur ───────────────────────────────────────────
                let opacity, blur;
                if (absSx <= fadeStartPx) {
                    // Core arc: slightly dim edges for depth but no blur
                    opacity = 1.0 - smoothstep(absSx / fadeStartPx) * 0.35;
                    blur = 0;
                } else {
                    // Fade zone: smoothstep for organic entry/exit
                    const t = smoothstep((absSx - fadeStartPx) / fadeWidth);
                    opacity = (1.0 - 0.35) * (1.0 - t); // 0.65 → 0
                    blur = t * maxBlur;
                }

                // ─── Z-index ─────────────────────────────────────────────────
                // Cards closer to the horizontal centre have a higher z-index.
                // We compute this purely from absSx — no phase tricks.
                // Multiply by 0.2 so the spread is fine-grained (200 units wide).
                const z = Math.round(500 - absSx * 0.2);

                // ─── Apply to DOM ─────────────────────────────────────────────
                el.style.transform = `translate3d(calc(-50% + ${sx.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0)`;
                el.style.opacity = opacity.toFixed(3);
                el.style.zIndex = z;
                el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";

                el.firstElementChild.style.transform = `scale(${s.toFixed(4)}) rotate(${r.toFixed(2)}deg)`;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    const handleEnter = () => { pausedRef.current = true; };
    const handleLeave = () => {
        pausedRef.current = false;
        lastTimeRef.current = null; // zero dt on resume — no velocity spike
    };

    return (
        <section
            style={{
                background: T.bg,
                paddingTop: "clamp(72px, 10vh, 120px)",
                paddingBottom: "clamp(72px, 10vh, 120px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>{CAROUSEL_CSS}</style>

            {/* ── Ambient background glows ── */}
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{
                    position: "absolute", top: "-15%", left: "25%",
                    width: 600, height: 600, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
                }} />
                <div style={{
                    position: "absolute", bottom: "-20%", right: "15%",
                    width: 450, height: 450, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)",
                }} />
            </div>

            {/* ── Section Header ── */}
            <div style={{ textAlign: "center", marginBottom: 72, position: "relative", zIndex: 600 }}>
                <h2
                    style={{
                        fontSize: "clamp(36px, 5vw, 60px)",
                        fontWeight: 800,
                        color: T.textPri,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        margin: "0 0 16px",
                    }}
                >
                    Meet Our Team
                </h2>
                <p
                    style={{
                        fontSize: "clamp(15px, 1.6vw, 18px)",
                        color: T.textMute,
                        fontWeight: 400,
                        maxWidth: 560,
                        margin: "0 auto",
                        lineHeight: 1.65,
                    }}
                >
                    Meet the passionate people building ASOC and driving innovation together.
                </p>
            </div>

            {/* ── Curved Carousel ── */}
            <div
                className="mtc-carousel"
                style={{ position: "relative", height: 440, width: "100%" }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
            >
                {Array.from({ length: SLOTS }, (_, i) => {
                    const member = TEAM[i % N_TEAM];
                    return (
                        <div
                            key={i}
                            ref={(el) => { cardEls.current[i] = el; }}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "42%",
                                willChange: "transform, opacity, filter",
                                visibility: "hidden",
                            }}
                        >
                            {/* Inner wrapper isolates scale+rotation from positional transform */}
                            <div style={{ willChange: "transform" }}>
                                <div
                                    className="mtc-card"
                                    style={{
                                        width: CARD_W,
                                        background: T.card,
                                        border: `1px solid ${T.border}`,
                                        borderRadius: 26,
                                        overflow: "hidden",
                                        boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
                                    }}
                                >
                                    {/* Photo */}
                                    <div style={{ position: "relative", overflow: "hidden" }}>
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "3 / 4",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                            loading="lazy"
                                        />
                                        <div
                                            aria-hidden
                                            style={{
                                                position: "absolute",
                                                inset: "auto 0 0 0",
                                                height: "30%",
                                                background: `linear-gradient(to top, ${T.card} 0%, transparent 100%)`,
                                                pointerEvents: "none",
                                            }}
                                        />
                                    </div>

                                    {/* Name & Role */}
                                    <div style={{ padding: "10px 16px 18px" }}>
                                        <h3
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: T.textPri,
                                                letterSpacing: "-0.01em",
                                                lineHeight: 1.3,
                                                margin: "0 0 3px",
                                            }}
                                        >
                                            {member.name}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: 12,
                                                color: T.textSec,
                                                fontWeight: 500,
                                                margin: 0,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}