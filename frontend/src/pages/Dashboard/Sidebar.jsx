import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Sparkles,
  Heart,
  Shirt,
  User,
  LogOut,
  SunMedium,
  MoonStar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/style-studio", icon: Sparkles, label: "Style Studio" },
  { path: "/dashboard/my-looks", icon: Heart, label: "My Looks" },
  { path: "/dashboard/my-wardrobe", icon: Shirt, label: "My Wardrobe" },
  { path: "/dashboard/profile", icon: User, label: "Profile" },
];

function Sidebar({ handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-full fixed left-0 top-0 bg-sidebar border-r border-sidebar-border z-40">
      <div className="px-6 pt-8 pb-6 flex items-center gap-2.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 shrink-0"
        >
          <path d="M50 35 C50 20, 65 20, 65 30 C65 38, 50 38, 50 45 C50 48, 50 48, 50 50" />
          <path d="M50 50 L20 68 C16 70.5, 17 76, 22 76 L78 76 C83 76, 84 70.5, 80 68 L50 50 Z" />
        </svg>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary leading-none">
            Fitzy<span className="text-red-500">.</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Your AI stylist</p>
        </div>
      </div>


      <nav className="flex flex-col gap-1 px-3 flex-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={
                `w-full justify-start gap-3 h-10 px-3 text-sm font-normal transition-all duration-200 ` +
                (isActive 
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 font-semibold border-l-2 border-red-500 rounded-l-none" 
                  : "hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400")
              }
              onClick={() => {
                sessionStorage.removeItem("dashboard_active");
                navigate(item.path);
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-sm font-normal text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <>
              <SunMedium className="h-4 w-4 shrink-0 text-yellow-500" />
              <span>Light theme</span>
            </>
          ) : (
            <>
              <MoonStar className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>Dark theme</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            sessionStorage.removeItem("dashboard_active");
            handleLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
