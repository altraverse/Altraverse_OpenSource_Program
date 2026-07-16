import React, { useState, useEffect } from "react";
import Footer from '../../components/footer';
import SpaceBackground from "../../component/layout/SpaceBackground";
import "../../component/layout/SpaceBackground.css";
import OrganisationCard from "./OrganisationCard";
import Navbar from "../../component/layout/Navbar";
import API from "../../api/axios";
import { Lock } from "lucide-react";

export default function OrganisationsPage() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/api/projects");
        if (response.data.success) {
          setOrganisations(response.data.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch participating organizations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06091b] text-white overflow-hidden font-body">
      {/* Background Canvas Layer (hidden on mobile) */}
      <div className="hidden sm:block">
        <SpaceBackground />
      </div>
      {/* Crescent Moon (hidden on mobile, visible from sm: matches Hero / AboutPage) */}
      <div className="hidden sm:block absolute moon-crescent rounded-full mt-5"
        style={{ top: 88, right: 80, width: 58, height: 58 }} />
      {/* Background Mesh Glow Layer */}
      <div 
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-25"
        style={{ background: "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(91,63,214,0.25) 0%, transparent 65%)" }} 
      />
      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 pt-24 pb-24 relative min-h-[70vh]">

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="h-10 w-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/40 text-xs font-mono">Loading dynamic cohort projects...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto py-12 px-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Main Content Area (which will be blurred out if there are no projects) */}
              <div className={organisations.length === 0 ? "blur-[6px] opacity-25 select-none pointer-events-none transition-all duration-500" : ""}>
                {/* Header Block */}
                <div className="m-12">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-violet-400 font-mono font-bold block mb-2 font-semibold">
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
                {organisations.length === 0 ? (
                  <div className="flex justify-around gap-6 flex-wrap">
                    {/* Mock locked card placeholders to fill screen space underneath the blur */}
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="w-[320px] h-[340px] rounded-3xl border border-white/5 bg-[#0c102b]/40 backdrop-blur-md" />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-around gap-6 flex-wrap">
                    {organisations.map((org, i) => (
                      <OrganisationCard
                        key={org.id}
                        item={org}
                        animDelay={i * 0.08}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Full Screen Absolute Lock Overlay */}
              {organisations.length === 0 && (
                <div className="fixed inset-x-0 top-24 bottom-0 z-20 flex flex-col items-center justify-center px-4">
                  {/* Subtle backdrop blur layer specifically for overlaying */}
                  <div className="absolute inset-0 bg-[#06091b]/40 backdrop-blur-[5px] pointer-events-none" style={{ WebkitBackdropFilter: "blur(5px)" }} />
                  
                  {/* Glassmorphic Lock Card */}
                  <div className="relative z-30 max-w-xl w-full mx-auto py-16 px-8 rounded-3xl border border-white/10 bg-[#0c102b]/70 backdrop-blur-xl relative overflow-hidden text-center shadow-2xl flex flex-col items-center justify-center">
                    {/* Decorative top gradient border */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                    
                    {/* Ambient blur orbs behind the lock */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Glowing Lock Container */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 blur-md opacity-35 scale-110" />
                      <div className="relative w-16 h-16 rounded-full bg-[#131947]/80 border border-white/10 flex items-center justify-center text-violet-400">
                        <Lock className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>

                    {/* Heading & Text */}
                    <h2 className="text-xl font-bold text-white mb-2">Projects May Be Announced Soon</h2>
                    <p className="text-xs text-white/50 font-light max-w-sm leading-relaxed mb-5">
                      Check back later or apply to register a new repository project.
                    </p>

                    {/* Pulsing Status Badge */}
                    <span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase font-bold bg-violet-500/10 border border-violet-500/25 px-4 py-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      projects may be announced soon
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
        <Footer />
      </div>
    </div>
  );
}
