import Navbar from "../../components/common/Navbar";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import CampusCoins from "../../components/home/CampusCoins";
import Features from "../../components/home/Features";
import FinalCTA from "../../components/home/FinalCTA";
import Footer from "../../components/common/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <CampusCoins />
        <Features />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

export default Home;