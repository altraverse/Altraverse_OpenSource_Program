import { Link } from "react-router-dom";
import Hero from "../home/Hero";

export default function Home() {
  return (
    <main className="min-h-[200vh] bg-[#030712] text-white">
      <Hero />

      <Link to="/login">
        <button>Join Community</button>
      </Link>
    </main>
  );
}
