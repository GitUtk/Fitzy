import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Moon } from "lucide-react";

export default function Header({ theme, toggleTheme, isDark }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500"
      style={{
        width: "100%",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(250, 248, 245, 0.4)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(24, 24, 27, 0.06)",
      }}
    >
      {/* Logo on the top left */}
      <Link to="/" className="flex items-center gap-2 group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105"
        >
          <path d="M50 35 C50 20, 65 20, 65 30 C65 38, 50 38, 50 45 C50 48, 50 48, 50 50" />
          <path d="M50 50 L20 68 C16 70.5, 17 76, 22 76 L78 76 C83 76, 84 70.5, 80 68 L50 50 Z" />
        </svg>
        <span className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Fitzy<span className="text-red-500">.</span>
        </span>
      </Link>

      {/* Action Controls on the top right */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={`rounded-full transition-colors duration-500 ${
            isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Link to="/login">
          <Button
            variant="ghost"
            className={`rounded-full text-sm px-5 py-2 transition-colors duration-500 ${
              isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button
            style={{
              backgroundColor: isDark ? "#ffffff" : "#18181b",
              color: isDark ? "#000000" : "#ffffff",
            }}
            className="rounded-full text-sm px-6 py-2.5 font-semibold transition-all shadow-md duration-500 hover:opacity-90"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
