import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import Profile from "../Profile/Profile";
import MyWardrobe from "./MyWardrobe";
import { Card, CardContent } from "@/components/ui/card";
import GenderModal from "../components/GenderModal";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [userFirstName, setUserFirstName] = useState("there");
  const [userGender, setUserGender] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);

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

      const fetchProfileName = async () => {
        try {
          const response = await fetch("https://fitzy-f7uv.onrender.com/api/v1/me", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            const firstName = (data.fullName || "").trim().split(/\s+/)[0];
            setUserFirstName(firstName || "there");
            
            const gender = data.gender || "";
            setUserGender(gender);
            if (!gender || (gender !== "Male" && gender !== "Female")) {
              setShowGenderModal(true);
            }
          } else {
            setUserFirstName("there");
          }
        } catch {
          setUserFirstName("there");
        }
      };
      fetchProfileName();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleGenderSuccess = (gender) => {
    setUserGender(gender);
    setShowGenderModal(false);
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Sidebar handleLogout={handleLogout} />
      <GenderModal isOpen={showGenderModal} onSuccess={handleGenderSuccess} />

      <main className="lg:ml-[260px] h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet
            context={{
              looks,
              loadingLooks,
              fetchLooks,
              userFirstName,
              userGender,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export function DashboardHome() {
  const { fetchLooks, userFirstName } = useOutletContext();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="bg-card shadow-none border-0">
        <CardContent className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
              Welcome, {userFirstName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Ready to pick up where you left off?
            </p>
          </div>
        </CardContent>
      </Card>
      <UploadSection onUploadSuccess={fetchLooks} variant="dashboard" />
    </div>
  );
}

export function DashboardLooks() {
  const { looks, loadingLooks } = useOutletContext();

  return (
    <div className="max-w-7xl mx-auto">
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
