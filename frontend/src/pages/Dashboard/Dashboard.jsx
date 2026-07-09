import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { MoonStar, SunMedium } from "lucide-react";
import Sidebar from "./Sidebar";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import Profile from "../Profile/Profile";
import MyWardrobe from "./MyWardrobe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [userFirstName, setUserFirstName] = useState("there");
  const [theme, setTheme] = useState("light");

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)",
          backgroundSize: "100% 100%",
        }}
      />
      <Sidebar handleLogout={handleLogout} />

      <main className="relative z-10 lg:ml-[260px] h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet
            context={{
              looks,
              loadingLooks,
              fetchLooks,
              userFirstName,
              theme,
              toggleTheme,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export function DashboardHome() {
  const { fetchLooks, userFirstName, theme, toggleTheme } = useOutletContext();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="bg-card shadow-none border-0">
        <CardContent className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Welcome, {userFirstName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Ready to pick up where you left off?
            </p>
          </div>
          <Button type="button" variant="outline" onClick={toggleTheme} className="shrink-0">
            {theme === "dark" ? (
              <>
                <SunMedium className="h-4 w-4" />
                Light theme
              </>
            ) : (
              <>
                <MoonStar className="h-4 w-4" />
                Dark theme
              </>
            )}
          </Button>
        </CardContent>
      </Card>
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
