import Navbar from "../../component/layout/Navbar";
import Footer from "../../components/footer";
import Roles from "../../component/home/Roles";

export default function RolesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#06091b] text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Roles Section */}
      <main className="flex-grow pt-10">
        <Roles />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
