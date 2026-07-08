// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import NavBar from "./NavBar";
// import Hero from "./Hero";
// import UploadSection from "./UploadSection";
// import SupportedStores from "./SupportedStores";
// import Benefits from "./benefits";
// import About from "./About";
// import Feedback from "./Feedback";
// // import Contact from "./ContactUs";
// import BrandTagline from "./BrandTagline";

// function LandingPage() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-[#F8F6F2] text-black overflow-x-hidden">

//       <NavBar />

//       <main>
//         <Hero />
//         <UploadSection />
//         <Benefits />
//         <About />
//         <SupportedStores />
//         {/* <Feedback /> */}
//         <BrandTagline />
//       </main>

//     </div>
//   );
// }

// export default LandingPage;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Hero from "./Hero";
import UploadSection from "./UploadSection";
import SupportedStores from "./SupportedStores";
import Benefits from "./benefits";
import About from "./About";
import Feedback from "./Feedback";
// import Contact from "./ContactUs";
import BrandTagline from "./BrandTagline";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)",
          backgroundSize: "100% 100%",
        }}
      />

      <div className="relative z-10">
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

    </div>
  );
}

export default LandingPage;
