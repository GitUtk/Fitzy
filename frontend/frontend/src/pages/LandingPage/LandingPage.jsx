import NavBar from "./NavBar";
import Hero from "./Hero";
import UploadSection from "./UploadSection";
import SupportedStores from "./SupportedStores";
import Benefits from "./benefits";
import About from "./About";
import Feedback from "./Feedback";
import Contact from "./ContactUs";

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[180px] rounded-full pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative z-10">
       <NavBar />

  <Hero />

  <UploadSection />

  <Benefits />

  

  <About />
  <SupportedStores />

  <Feedback />
    <Contact />

      </main>
    </div>
  );
}

export default LandingPage;