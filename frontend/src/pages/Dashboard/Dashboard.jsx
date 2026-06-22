import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import Profile from "../Profile/Profile";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchLooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingLooks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/upload/looks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLooks(data);
      }
    } catch (err) {
      console.error("Error fetching looks:", err);
    } finally {
      setLoadingLooks(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchLooks();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <Header />

        {activeTab === "dashboard" ? (
          <div className="grid xl:grid-cols-2 gap-5 mt-5">
            <UploadSection onUploadSuccess={fetchLooks} />
            <RecentLooks looks={looks} loading={loadingLooks} />
          </div>
        ) : (
          <Profile />
        )}
      </main>
    </div>
  );
}

export default Dashboard;