import React, { useState } from "react";
import Footer from '../../components/footer';


export const organisations = [
  {
    id: 1,
    title: "Gardener Ecosystem",
    tag: "Automation",
    color: "violet",
    points: 150,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", // Premium abstract mesh
    description: "Contribute to building robust environment automation layers, resource scheduling tools, and distributed task runner engines.",
    stars: 142,
    forks: 38,
    date: "4 Issues open"
  },
  {
    id: 2,
    title: "TARS Core Web",
    tag: "Fullstack",
    color: "cyan",
    points: 200,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop",
    description: "Optimize high-performance web components, real-time sync systems, and custom shader layouts across developer toolkits.",
    stars: 89,
    forks: 12,
    date: "7 Issues open"
  },
  {
    id: 3,
    title: "Shadcn Dark Extensions",
    tag: "UI / UX",
    color: "emerald",
    points: 100,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
    description: "Expand a highly accessible design package geared explicitly towards deep-space backgrounds and complex data tables.",
    stars: 310,
    forks: 54,
    date: "2 Issues open"
  }];

import OrganisationCard from "./OrganisationCard";
import Navbar from "../../component/layout/Navbar";

export default function OrganisationsPage() {
  return (
    <div className="hero2 relative min-h-screen text-white overflow-hidden font-body">
      {/* Background Canvas Layer */}

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">

          {/* Header Block */}
          <div className="m-12">
            <span className="text-[10px] tracking-[0.2em] uppercase text-violet-400 font-mono font-bold block mb-2">
              Choose based on your preference and start contributing.
            </span>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              Participating Organisations
            </h1>
            <p className="text-white/40 text-sm mt-2 font-light">
              Start your open source journey today
            </p>
          </div>

          {/* Core Grid Matrix Layout */}
          <div className="flex justify-around gap-4 flex-wrap">
            {organisations.map((org, i) => (
              <OrganisationCard
                key={org.id}
                item={org}
                animDelay={i * 0.08}
              />
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
