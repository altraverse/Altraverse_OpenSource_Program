import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";

const Resources = () => {
  // Real Articles for Bento Grid with Contextual Unsplash Images
  const blogs = [
    {
      id: 1,
      title: "Learn How to Use Git and GitHub – A Beginner-Friendly Handbook",
      desc: "A comprehensive deep-dive by freeCodeCamp breaking down staging areas, commits, branching, remote repositories, and how to safely navigate pull requests without breaking the codebase.",
      tag: "Basics",
      url: "https://www.freecodecamp.org/news/learn-how-to-use-git-and-github-a-beginner-friendly-handbook/",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
      cardStyle: "md:col-span-2 md:row-span-2 bg-indigo-500/10 border border-indigo-500/30 text-slate-100",
    },
    {
      id: 2,
      title: "Open Source Etiquette: Professional Maintainer Communication",
      desc: "MDN's official framework for collaborating politely, writing explicit bug reports, handling critical reviews, and honoring project code of conducts.",
      tag: "Community",
      url: "https://developer.mozilla.org/en-US/docs/MDN/Community/Open_source_etiquette",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
      cardStyle: "md:col-span-1 md:row-span-1 border border-slate-800 text-slate-100 backdrop-blur-md",
    },
    {
      id: 3,
      title: "How to Choose Your First Open Source Issue Without Getting Lost",
      desc: "An actionable guide from Medium detailing how to filter target codebases by technical stack and find high-quality, maintainer-vetted 'good first issue' labels.",
      tag: "Navigation",
      url: "https://medium.com/@aysunitai/how-i-chose-my-first-open-source-issue-without-getting-lost-8863f283bca3",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
      cardStyle: "md:col-span-1 md:row-span-2 bg-emerald-500/5 border border-emerald-500/20 text-slate-100 backdrop-blur-md",
    },
    {
      id: 4,
      title: "A Beginner's Journey and Common Mistakes in Open Source",
      desc: "A raw, real perspective published on Dev.to about jumping into codebases, pushing non-code improvements like documentation, and setting realistic expectations.",
      tag: "Non-Code",
      url: "https://dev.to/owaspblt/a-beginners-guide-to-open-source-contributions-from-my-journey-and-mistakes-adi",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
      cardStyle: "md:col-span-2 md:row-span-1 border border-slate-800 text-slate-100 backdrop-blur-md",
    },
  ];

  // YouTube Video Embed Codes
  const videos = [
    { id: "CML6vfKjQss", title: "Git and GitHub for Beginners - freeCodeCamp" },
    { id: "o6xikISiz2w", title: "Open Source Crash Course - Beginner Guide" },
    { id: "BdgwH614LM0", title: "How to Contribute to Open Source Projects" },
  ];

  return (
    <div className="hero min-h-screen flex flex-col justify-between antialiased relative overflow-hidden bg-slate-950">

      {/* BACKGROUND GLOW EFFECT */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full pointer-events-none z-0 opacity-70"
        style={{
          WebkitBoxShadow: "0px 0px 196px 64px rgba(2,66,244,0.45)",
          MozBoxShadow: "0px 0px 196px 64px rgba(2,66,244,0.45)",
          boxShadow: "0px 0px 196px 64px rgba(2,66,244,0.45)"
        }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24 flex-grow w-full relative z-10">

        {/* Header Section */}
        <section className="mt-20 text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Open Source Resources
          </h1>
          <p className="text-lg text-slate-400">
            Your launchpad for understanding open-source development and starting your contribution journey today.
          </p>
        </section>

        {/* 1. Bento Grid Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Curated Reads for Beginners
          </h2>
          <div className="grid gap-4 ">
            {blogs.map((blog) => (
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                key={blog.id}
                className={`group p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] relative overflow-hidden ${blog.cardStyle}`}
              >
                {/* Background Image overlay with low opacity & smooth scale on hover */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Card Content wrapper to force it above image layer */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold tracking-wider uppercase bg-white/10 text-slate-300 px-2.5 py-1 rounded-full w-fit">
                        {blog.tag}
                      </span>
                      <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Read Article ↗
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-4 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 md:line-clamp-3 mt-2">
                    {blog.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 2. YouTube Embeds Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🎥</span> Essential Video Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="rounded-2xl overflow-hidden border border-slate-800 group transition-all duration-300 hover:border-slate-700 bg-slate-950/40 backdrop-blur-md">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-300 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Open Source Legend Quote Section */}
        <section className="border border-slate-800 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto bg-slate-950/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Legend Image */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-800 shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/1024025?v=4"
                alt="Linus Torvalds portrait"
                className="w-full h-full object-cover grayscale contrast-125 opacity-80"
              />
            </div>

            {/* Quote content */}
            <div className="space-y-4 text-center md:text-left">
              <span className="text-4xl text-indigo-400 font-serif leading-none block">“</span>
              <blockquote className="text-xl md:text-2xl font-medium text-slate-200 italic leading-relaxed -mt-4">
                Open source allows people to build on a solid base of previous knowledge, without some silly hiding. Open source is the right thing to do, the same way I believe science is better than alchemy.
              </blockquote>
              <div>
                <cite className="not-italic font-bold text-white block text-lg">
                  Linus Torvalds
                </cite>
                <span className="text-sm text-slate-400 font-medium">
                  Creator of Linux & Git
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Resources
