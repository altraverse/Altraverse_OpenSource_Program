import React, { useState } from "react";
import { announcements } from "../data/announcements";
import Navbar from "../component/layout/Navbar";
import FeaturedCard from "./FeaturedCard";
import HeroSection from "./HeroSection";
import SideCard from "./SideCard";
import MiniCard from "./MiniCard";
import FilterBar from "./FilterBar";
import StatsBar from "./StatsBar";
import Footer from "./footer";

export default function AnnouncementsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const featured = announcements.find((a) => a.featured);
  const filtered = activeFilter === "all"
    ? announcements.filter((a) => !a.featured)
    : announcements.filter((a) => !a.featured && a.category === activeFilter);

  const sideCards = filtered.slice(0, 3);
  const miniCards = filtered.slice(3);

  return (
    <div style={{ background: "#06091b", minHeight: "100vh", color: "#fff" }}>
      <Navbar />
      <HeroSection />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-gradient-to-r from-violet-DEFAULT to-transparent" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-violet-DEFAULT">
                Program Announcements
              </span>
            </div>
            <h2 className="font-body font-bold text-white leading-tight text-2xl sm:text-[26px]"
              style={{ letterSpacing: "-0.01em" }}>
              Stay ahead of every update
            </h2>
            <p className="font-body text-[13px] text-white/40 mt-1.5 font-light">
              All tasks, deadlines, events, and rewards — all in one place
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
            <a href="#" className="font-body text-[12px] text-violet-DEFAULT hover:opacity-75 transition-opacity duration-200 whitespace-nowrap">
              View all →
            </a>
          </div>
        </div>

        {/* Magazine grid: Stacked on mobile, 2 columns on desktop (lg) */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">
            {/* Featured spotlight */}
            <FeaturedCard item={featured} />

            {/* Side stack */}
            <div className="flex flex-col gap-3 min-w-0 overflow-hidden">
              {sideCards.length > 0 ? (
                sideCards.map((item, i) => (
                  <SideCard key={item.id} item={item} animDelay={0.35 + i * 0.1} />
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[200px] lg:h-full border border-white/5 rounded-xl text-white/30 text-sm font-body bg-white/[0.02]">
                  No announcements in this category.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom mini-card row: Responsive grid columns */}
        {miniCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {miniCards.map((item, i) => (
              <MiniCard key={item.id} item={item} animDelay={0.55 + i * 0.1} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!featured && filtered.length === 0 && (
          <div className="text-center py-20 text-white/30 font-body text-[14px]">
            No announcements in this category yet.
          </div>
        )}
      </section>

      {/* Stats bar */}
      <StatsBar />

      <Footer />
    </div>
  );
}
