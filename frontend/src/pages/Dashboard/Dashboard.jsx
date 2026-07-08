import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import Profile from "../Profile/Profile";
import MyWardrobe from "./MyWardrobe";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [userFirstName, setUserFirstName] = useState("there");

  const fetchLooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingLooks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/upload/looks`, {
        headers: { Authorization: `Bearer ${token}` },
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

      const savedProfileStr = localStorage.getItem("userProfile");
      if (savedProfileStr) {
        try {
          const savedProfile = JSON.parse(savedProfileStr);
          const firstName = (savedProfile.fullName || "")
            .trim()
            .split(/\s+/)[0];
          setUserFirstName(firstName || "there");
        } catch {
          setUserFirstName("there");
        }
      } else {
        setUserFirstName("there");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Sidebar handleLogout={handleLogout} />

      <main className="lg:ml-[260px] h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="mb-6 border-zinc-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Welcome, {userFirstName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ready to pick up where you left off?
                </p>
              </div>
            </CardContent>
          </Card>
          <Outlet
            context={{
              looks,
              loadingLooks,
              fetchLooks,
              userFirstName,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export function DashboardHome() {
  const { fetchLooks } = useOutletContext();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <UploadSection onUploadSuccess={fetchLooks} variant="dashboard" />
    </div>
  );
}

export function DashboardLooks() {
  const { looks, loadingLooks } = useOutletContext();

  return (
    <div className="max-w-6xl mx-auto">
      <RecentLooks
        looks={looks}
        loading={loadingLooks}
        title="My Looks"
        subtitle="Outfits you have tried on appear here."
      />
    </div>
  );
}

export function DashboardWardrobe() {
  return <MyWardrobe />;
}

export function DashboardProfile() {
  return <Profile />;
}

export default Dashboard;
