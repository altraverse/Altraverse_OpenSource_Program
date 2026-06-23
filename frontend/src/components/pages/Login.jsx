import { Navigate } from "react-router-dom";
import {
  Code,
  Laptop,
  Trophy,
  Shield,
  Lock,
  Users,
  Rocket,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import loginBg from "../../assets/bg.png";

const Login = () => {
  const { user, loading } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-white">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/community" replace />;
  }

  const features = [
    {
      icon: Code,
      title: "Collaborate",
      desc: "Work together on real-world open source projects.",
    },
    {
      icon: Laptop,
      title: "Contribute",
      desc: "Write code, fix bugs, and improve the ecosystem.",
    },
    {
      icon: Trophy,
      title: "Grow Together",
      desc: "Learn, earn, and grow with a global developer community.",
    },
  ];

  const footerItems = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      desc: "Your data is safe with us.",
    },
    {
      icon: Lock,
      title: "Open Source First",
      desc: "Built by developers, for developers.",
    },
    {
      icon: Users,
      title: "Global Community",
      desc: "Join thousands of contributors.",
    },
    {
      icon: Rocket,
      title: "Impact Driven",
      desc: "Build projects that matter.",
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat px-4 py-4 text-white"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col">
        <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#0b0128]/40 px-5 py-4 backdrop-blur-xl">
          <h3 className="text-xl font-bold">Altraverse</h3>

          <ul className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
            <li className="cursor-pointer hover:text-white">Home</li>
            <li className="cursor-pointer hover:text-white">Projects</li>
            <li className="cursor-pointer hover:text-white">Community</li>
            <li className="cursor-pointer hover:text-white">Events</li>
          </ul>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white px-5 py-2 text-sm text-white">
              Login
            </button>
            <button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-medium text-white">
              Get Started
            </button>
          </div>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-between gap-10 py-10 lg:flex-row">
          <section className="w-full flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Welcome{" "}
              <span className="bg-gradient-to-r from-[#7f5af0] to-[#ff7ad9] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,122,217,0.5)]">
                Back
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-300">
              Continue your open source journey and make an impact together.
            </p>

            <div className="mt-8 space-y-6">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:text-left lg:items-center"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6a5cff] to-[#8f7bff] shadow-[0_0_15px_rgba(120,100,255,0.5)]">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#2d3446] bg-[#030336]/85 p-8 shadow-2xl">
            <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#cec2f0] to-transparent shadow-[0_0_15px_#7f5af0]" />

            <h2 className="text-2xl font-bold">Login to your account</h2>
            <p className="mt-2 text-sm text-gray-400">
              Glad to see you again! 👋
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="cursor-pointer mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-gray-200"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/330px-Google_Favicon_2025.svg.png"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-400">
              New contributor?{" "}
              <span className="font-medium text-[#7f5af0]">
                Google login creates your account automatically.
              </span>
            </p>
          </section>
        </main>

        <footer className="grid gap-4 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          {footerItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6a5cff] to-[#8f7bff] shadow-[0_0_12px_rgba(120,100,255,0.5)]">
                  <Icon size={15} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-xs text-slate-300">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </footer>
      </div>
    </div>
  );
};

export default Login;
