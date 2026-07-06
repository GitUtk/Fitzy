// import { Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage/LandingPage";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Pricing from "./pages/Pricing/Pricing";
// import StyleStudio from "./pages/StyleStudio/StyleStudio";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/pricing" element={<Pricing />} />
//       <Route path="/style-studio" element={<StyleStudio />} />
//     </Routes>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pricing from "./pages/Pricing/Pricing";
import StyleStudio from "./pages/StyleStudio/StyleStudio";

import ProfileSetup from "./pages/ProfileSetup/ProfileSetup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/style-studio" element={<StyleStudio />} />
    </Routes>
  );
}

export default App;