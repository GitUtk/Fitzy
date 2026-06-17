import NavBar from "./NavBar";
import Hero from "./Hero";
import UploadSection from "./UploadSection";
import SupportedStores from "./SupportedStores";
import Benefits from "./benefits";
import About from "./About";
import Feedback from "./Feedback";
<<<<<<< HEAD
import Contact from "./ContactUs";
=======
import BrandTagline from "./BrandTagline";
>>>>>>> 89ac0fd (ui changes)

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-black overflow-x-hidden">

      <NavBar />

      <main>
        <Hero />
        <UploadSection />
        <Benefits />
        <About />
        <SupportedStores />
        {/* <Feedback /> */}
        <BrandTagline />
      </main>

    </div>
  );
}

export default LandingPage;