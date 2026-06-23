import heroBg from "../../assets/hero-bg-new.png";
import heroMan from "../../assets/hero-man.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Background image */}
      {/* <img
        src={heroBg}
        alt="Open source night sky"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
      /> */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(109,40,217,0.35)_0%,rgba(59,130,246,0.18)_20%,rgba(11,31,94,0.85)_45%,#030712_100%)]" />

      <img
        src={heroMan}
        className="absolute inset-0 h-75 w-75 object-cover object-center opacity-80"
      />

      {/* Glow */}
      {/* <div className="absolute left-20 top-32 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" /> */}
      {/* <div className="absolute right-20 top-40 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" /> */}

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Open Source Contribution Platform
          </p>

          <h1 className="text-5xl font-light leading-tight text-white md:text-7xl">
            Code. Contribute. <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Create Impact.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
            Discover open-source projects, claim issues, submit pull requests,
            earn badges, and grow with a powerful developer community.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105">
              Start Contributing
            </button>

            <button className="rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
              Explore Projects
            </button>
          </div>

          <div className="mt-14 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="text-2xl font-semibold text-white">50K+</h3>
              <p className="mt-1 text-sm text-white/55">Contributors</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="text-2xl font-semibold text-white">1K+</h3>
              <p className="mt-1 text-sm text-white/55">Projects</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="text-2xl font-semibold text-white">5M+</h3>
              <p className="mt-1 text-sm text-white/55">Lines Code</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
