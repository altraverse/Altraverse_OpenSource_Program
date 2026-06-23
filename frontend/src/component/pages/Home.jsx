import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Navbar from "@/component/layout/Navbar";
// import Footer from "@/component/layout/Footer";
// import Hero from "@/component/home/Hero";
import WhyJoin from "@/component/home/WhyJoin";
import Stats from "@/component/home/Stats";
import EventSection from "@/component/home/EventSection";
import Hero from "../home/Hero";
import Footer from "../../components/footer";
import { InteractiveNetworkBackground } from "../../components/interactive-network-background";




const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Home() {
  // useEffect(() => {
  //   // // @ts-ignore
  //    if (window.particlesJS) {
  //      // @ts-ignore
  //      window.particlesJS.load("star", "/net.json", function() {
  //        console.log("callback - particles.js config loaded");
  //      });
  //    }
  // }, []);

  return (
    <div className="min-h-screen bg-brand1 text-white overflow-x-hidden selection:bg-brand2">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Sponsors Section (Marquee / Grid) */}
      <section className="py-12 border-b border-white/10 bg-brand1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">
            Backed By Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Vercel", "GitHub", "DigitalOcean", "JetBrains", "Discord"].map(
              (sponsor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2"
                >
                  {sponsor}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* How it Works / Timeline */}
      <EventSection />

      {/* Why ASOC */}
      <WhyJoin />

      {/* Stats and Community Banner Wrapper */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-16 bg-brand2">
        <div className="max-w-7xl mx-auto">
          {/* Community Banner Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-blue-900/30"
          >
            {/* Background */}
            <img
              src="scenery.png"
              alt="scenery"
              className="z-2 absolute bottom-0 left-0 w-full object-cover pointer-events-none"
            />

            {/* Character */}
            <img
              src="boy.webp"
              alt="boy"
              className="
            absolute
            bottom-0
            right-0
            w-40
            sm:w-56
            md:w-72
            lg:w-96
            z-10
            pointer-events-none
          "
            />

            {/* Stars */}
            // <div id="star" className="absolute inset-0" />
            <InteractiveNetworkBackground />

            {/* Content */}
            <div className="relative z-20 max-w-xl p-10 md:p-20">
              <span className="text-blue-400 text-sm md:text-base font-semibold tracking-wider">
                OPEN SOURCE IS FOR EVERYONE
              </span>

              <h3 className="text-3xl md:text-5xl font-bold my-6">
                Build the future together
              </h3>

              <p className="text-gray-300 leading-relaxed mb-8">
                From beginners to advanced developers, everyone has a place in
                open source. Find projects, fix bugs, add features, and make a
                difference.
              </p>

              <Button className="buttonGradient">
                Start Contributing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <Stats />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-16 bg-slate-50 text-slate-900 border-t border-slate-200">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full space-y-4"
          >
            <AccordionItem
              value="item-1"
              className="bg-white px-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4">
                How do I register as a contributor?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                Registration opens annually. Keep an eye on our social media
                handles and the "Get Started" button for the application link.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-white px-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4">
                Is there an age limit?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                No! ASOC is open to students and enthusiasts of all ages and
                skill levels.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-white px-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline font-semibold py-4">
                Do I get a certificate?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                Yes, all active contributors who meet the minimum participation
                requirements receive a certificate of completion.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
      <Footer />
    </div>
  );
}

export default Home;
