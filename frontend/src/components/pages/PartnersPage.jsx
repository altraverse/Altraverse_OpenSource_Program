import React from "react";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import { motion } from "motion/react";
import { Globe, Phone, Mail, Award, Users2, ShieldCheck, ArrowRight } from "lucide-react";
import infynixLogo from "../../assets/infynix_logo.png";
import codenbuildLogo from "../../assets/codenbuild_logo.png";
import workLyftLogo from "../../assets/workLyft .png";

const LinkedinIcon = ({ className, size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0z" />
  </svg>
);

const partnersData = [
  {
    id: 1,
    name: "Infynix Tech",
    role: "Co-Sponsor / Partnership",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    glowColor: "rgba(139,92,246,0.12)",
    logoInitials: "IT",
    logo: infynixLogo,
    motto: "Innovate • build • deliver",
    description: "Empowering Students with Internships, Workshops, Startup Support, and Real-World Tech Opportunities.",
    ceo: "Tanvi Lohkar",
    cto: "Bhushan Angaitkar",
    phone: "+91 7588660669",
    email: "infynixtech16@gmail.com",
    website: "https://infynixtech.tech/",
    linkedin: "https://www.linkedin.com/company/infynix-tech-16/",
    gradient: "from-violet-500 to-indigo-600"
  },
  {
    id: 2,
    name: "CodenBuild Technologies",
    role: "Co-Sponsor / Partner",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glowColor: "rgba(34,211,168,0.10)",
    logoInitials: "CB",
    logo: codenbuildLogo,
    motto: "Learn. Build. Innovate.",
    description: "CodenBuild Technologies is a technology-driven organization committed to empowering students and businesses through innovation, AI, software development, automation, internships, workshops, hackathons, and industry-oriented learning. Our mission is to bridge the gap between education and industry.",
    ceo: "Ishwari Dambhe",
    cto: "Soham Thakare",
    phone: "+91 7822916318",
    email: "codenbuild.events@gmail.com",
    website: "https://codenbuild.tech/",
    linkedin: "https://www.linkedin.com/company/codenbuild/",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    name: "WorkLyft Solutions",
    role: "Co-Sponsor / Partner",
    badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    glowColor: "rgba(14,165,233,0.10)",
    logoInitials: "WL",
    logo: workLyftLogo,
    motto: "Empowering Talent. Accelerating Businesses.",
    description: "WorkLyft Solutions is a technology-driven startup focused on empowering students through industry-oriented internships and professional training while helping businesses grow with innovative digital solutions. We specialize in custom software development, AI automation, web and mobile application development, and business digital transformation. Our mission is to bridge the gap between education and industry by creating opportunities for aspiring professionals and delivering impactful technology solutions to businesses.",
    ceo: "Ayaan Sheikh",
    cto: "Tuba Naaz",
    phone: "+91 8007574169",
    email: "worklyft.business@gmail.com",
    website: "https://worklyft.in",
    linkedin: "https://www.linkedin.com/company/worklyft",
    gradient: "from-sky-500 to-blue-600"
  },
  {
    id: 4,
    name: "JJ28",
    role: "Co-Sponsor",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    glowColor: "rgba(245,158,11,0.10)",
    logoInitials: "JJ",
    motto: "Build with passion",
    description: "Provide IT solution with IT collaborations.",
    owner: "Jai Jadhav",
    phone: "+91 80804 64582",
    email: "jaijadhav28@gmail.com",
    website: "https://jj28.netlify.app/",
    linkedin: "https://www.linkedin.com/in/jj28/",
    gradient: "from-amber-500 to-orange-600"
  },
  // {
  //   id: 3,
  //   name: "DevFlow Labs",
  //   role: "Technology Partner",
  //   badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  //   glowColor: "rgba(59,130,246,0.10)",
  //   logoInitials: "DF",
  //   motto: "Streamlining developer workflows.",
  //   description: "DevFlow Labs specializes in build automation, continuous delivery tools, and cloud developer environments. They support open-source developers by providing sandbox resources and automated pipeline environments for scaling projects.",
  //   ceo: "Raghav Joshi",
  //   cto: "Divya Deshmukh",
  //   phone: "+91 9876543210",
  //   email: "hello@devflowlabs.com",
  //   website: "https://infynixtech.tech/",
  //   linkedin: "https://www.linkedin.com/company/infynix-tech-16/",
  //   gradient: "from-blue-500 to-indigo-600"
  // },
  // {
  //   id: 4,
  //   name: "CloudSphere Technologies",
  //   role: "Infrastructure Partner",
  //   badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  //   glowColor: "rgba(6,182,212,0.10)",
  //   logoInitials: "CS",
  //   motto: "Scaling the cloud, simply.",
  //   description: "CloudSphere is a cloud computing provider that offers scalable cloud databases, storage solutions, and serverless hosting infrastructure to support open-source project deployments and hosting grants for participants.",
  //   ceo: "Aditya Sen",
  //   cto: "Megha Rawat",
  //   phone: "+91 8765432109",
  //   email: "contact@cloudsphere.io",
  //   website: "https://codenbuild.tech/",
  //   linkedin: "https://www.linkedin.com/company/codenbuild/",
  //   gradient: "from-cyan-500 to-blue-600"
  // },
  // {
  //   id: 5,
  //   name: "ByteCraft Solutions",
  //   role: "Hackathon Sponsor",
  //   badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  //   glowColor: "rgba(245,158,11,0.10)",
  //   logoInitials: "BC",
  //   motto: "Crafting digital excellence.",
  //   description: "ByteCraft Solutions builds high-performance enterprise systems, automates heavy operations, and supports student communities by sponsoring cash grants and merchandise rewards for top cohort contributors.",
  //   ceo: "Vicky Ranaut",
  //   cto: "Pooja Hegde",
  //   phone: "+91 7654321098",
  //   email: "info@bytecraft.in",
  //   website: "https://infynixtech.tech/",
  //   linkedin: "https://www.linkedin.com/company/infynix-tech-16/",
  //   gradient: "from-amber-500 to-orange-600"
  // },
  // {
  //   id: 6,
  //   name: "AppForge Dynamics",
  //   role: "Community Partner",
  //   badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  //   glowColor: "rgba(244,63,94,0.10)",
  //   logoInitials: "AD",
  //   motto: "Forging ideas into mobile realities.",
  //   description: "AppForge is a mobile development house building user-centric Android & iOS apps. They support participants by organizing interactive UI/UX bootcamps and design workshops during the contribution phase.",
  //   ceo: "Nikhil Malhotra",
  //   cto: "Swati Verma",
  //   phone: "+91 6543210987",
  //   email: "dynamic@appforge.dev",
  //   website: "https://codenbuild.tech/",
  //   linkedin: "https://www.linkedin.com/company/codenbuild/",
  //   gradient: "from-rose-500 to-pink-600"
  // }
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#06091b] text-white overflow-x-hidden selection:bg-indigo-500/30 relative">
      {/* Background Mesh Glow Layers */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-25"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(91,63,214,0.25) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-10"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 75%)" }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-2.5"
          >
            <div className="h-px w-6 bg-gradient-to-r from-violet-400 to-transparent" />
            <span className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-violet-400">
              Co-Sponsorship & Partnerships
            </span>
            <div className="h-px w-6 bg-gradient-to-l from-violet-400 to-transparent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight font-display"
          >
            Our Program <span className="gradient-text font-extrabold">Partners</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/45 max-w-xl mx-auto text-xs sm:text-sm font-light leading-relaxed"
          >
            We collaborate with forward-thinking organisations to bring practical internships, mentor guidance, technology support, and industry-oriented opportunities to our developers.
          </motion.p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-stretch justify-start gap-6">
          {partnersData.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative w-full md:w-[380px] rounded-2xl overflow-hidden border border-white/5 bg-[#0c102b]/15 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] flex flex-col justify-between group shadow-lg"
            >
              {/* Decorative Glow */}
              <div
                className="absolute top-0 right-0 w-36 h-36 pointer-events-none rounded-tr-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-45"
                style={{ background: `radial-gradient(circle at 85% 15%, ${partner.glowColor} 0%, transparent 70%)` }}
              />

              <div>
                {/* Header Row: Logo & Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  {/* Brand Initials / Logo Box */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shadow-md ${partner.logo ? "bg-white p-1" : `bg-gradient-to-br ${partner.gradient} text-white font-extrabold text-base`}`}>
                    {partner.logo ? (
                      <img src={partner.logo} alt={`${partner.name} Logo`} className="w-full h-full object-contain" />
                    ) : (
                      partner.logoInitials
                    )}
                  </div>

                  {/* Partnership Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-extrabold font-mono uppercase tracking-wider border ${partner.badgeColor}`}>
                    {partner.role}
                  </span>
                </div>

                {/* Company Name */}
                <h2 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight text-left">
                  {partner.name}
                </h2>

                {/* Motto */}
                <p className="font-mono text-[10px] font-semibold text-violet-400/90 mb-3 text-left leading-relaxed pl-2 border-l-2 border-violet-500/30">
                  "{partner.motto}"
                </p>

                {/* Description */}
                <p className="text-white/45 text-[11px] sm:text-xs font-light leading-relaxed mb-4 text-left line-clamp-3">
                  {partner.description}
                </p>

                {/* Leadership Section */}
                <div className="border-t border-white/5 pt-3 mb-4 text-left">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-2">
                    {partner.owner ? "Sponsor / Owner" : "Leadership Team"}
                  </span>
                  <div className="flex gap-2 text-[11px]">
                    {partner.owner ? (
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] uppercase tracking-wider text-gray-500 block">Owner</span>
                        <span className="font-semibold text-white/80 truncate block">{partner.owner}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500 block">CEO</span>
                          <span className="font-semibold text-white/80 truncate block">{partner.ceo}</span>
                        </div>
                        {partner.cto && (
                          <div className="flex-1 min-w-0 border-l border-white/5 pl-2.5">
                            <span className="text-[8px] uppercase tracking-wider text-gray-500 block">CTO</span>
                            <span className="font-semibold text-white/80 truncate block">{partner.cto}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="border-t border-white/5 pt-3 mb-4 text-left">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-2">
                    Get In Touch
                  </span>
                  <div className="flex items-center justify-between gap-2 text-[10px] text-white/40">
                    <a
                      href={`mailto:${partner.email}`}
                      className="hover:text-white transition-colors flex items-center gap-1 min-w-0 max-w-[155px]"
                    >
                      <Mail size={11} className="text-indigo-400/80 flex-shrink-0" />
                      <span className="truncate">{partner.email}</span>
                    </a>
                    <a
                      href={`tel:${partner.phone.replace(/\s+/g, '')}`}
                      className="hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Phone size={11} className="text-indigo-400/80 flex-shrink-0" />
                      <span>{partner.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(partner.linkedin || partner.website || partner.email || partner.phone) && (
                <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto">
                  {partner.linkedin ? (
                    <a
                      href={partner.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] font-semibold text-white transition-all cursor-pointer"
                    >
                      <LinkedinIcon size={12} className="text-sky-400/80" />
                      LinkedIn
                    </a>
                  ) : partner.email ? (
                    <a
                      href={`mailto:${partner.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] font-semibold text-white transition-all cursor-pointer"
                    >
                      <Mail size={12} className="text-indigo-400/80" />
                      Email
                    </a>
                  ) : null}

                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r ${partner.gradient} hover:opacity-95 text-[10px] font-bold text-white shadow-md transition-all cursor-pointer`}
                    >
                      <Globe size={11} />
                      Website
                    </a>
                  ) : partner.phone ? (
                    <a
                      href={`tel:${partner.phone.replace(/\s+/g, '')}`}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r ${partner.gradient} hover:opacity-95 text-[10px] font-bold text-white shadow-md transition-all cursor-pointer`}
                    >
                      <Phone size={11} />
                      Call
                    </a>
                  ) : null}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
