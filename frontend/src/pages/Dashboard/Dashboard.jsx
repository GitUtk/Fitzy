import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCards from "./Statscards";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import PremiumBanner from "./PremiumBanner";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex">

      <Sidebar handleLogout={handleLogout} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">

        <Header />

        <StatsCards />

        <div className="grid xl:grid-cols-2 gap-5 mt-5">

          <UploadSection />

          <RecentLooks />

        </div>

        <PremiumBanner />

      </main>

    </div>
  );
}

export default Dashboard;