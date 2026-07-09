import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
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
      <div className="px-6 pt-8 pb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-primary">
          Fitzy
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your AI stylist</p>
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
                `w-full justify-start gap-3 h-10 px-3 font-normal ` +
                (isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "")
              }
              onClick={() => navigate(item.path)}
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
          className="w-full justify-start gap-3 h-10 px-3 font-normal text-muted-foreground hover:text-foreground"
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
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
