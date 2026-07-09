import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import { MoveRight } from "lucide-react";
import Header from "./components/Header";
import Slogan from "./components/Slogan";
import RevolvingWheel from "./components/RevolvingWheel";

function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Initialize theme synchronously from localStorage to prevent flash of dark theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : "dark";
    const initialTheme = savedTheme === "light" ? "light" : "dark";
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
    return initialTheme;
  });

  // Track page scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress using spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  // 1. Auto-rotation motion value for continuous background spin
  const autoRotation = useMotionValue(0);

  useEffect(() => {
    // Spin continuously: 360 degrees every 60 seconds
    const controls = animate(autoRotation, 360, {
      ease: "linear",
      duration: 60,
      repeat: Infinity,
    });
    return controls.stop;
  }, [autoRotation]);

  // 2. Scroll-based rotation offset
  const scrollRotation = useTransform(smoothProgress, [0, 1], [0, 180]);

  // Combined rotation: autoRotation + scrollRotation
  const wheelRotation = useTransform(
    [autoRotation, scrollRotation],
    ([latestAuto, latestScroll]) => latestAuto + latestScroll
  );
  
  // Pull the wheel up/down slightly as you scroll for dynamic perspective
  const wheelY = useTransform(smoothProgress, [0, 1], [0, -100]);

  // Fade out slogan text as user scrolls down (using raw scrollYProgress to prevent spring-mount opacity bugs)
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "dark";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[220vh] selection:bg-red-500/20 transition-colors duration-500 ${
        isDark ? "text-white" : "text-zinc-900"
      }`}
      style={{ backgroundColor: isDark ? "#000000" : "#FAF8F5" }}
    >
      {/* ─── Fixed Header Chunk ─── */}
      <Header theme={theme} toggleTheme={toggleTheme} isDark={isDark} />

      {/* ─── Sticky Content Section ─── background must match parent exactly to prevent black band */}
      <div
        className="sticky top-0 w-full h-screen flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: isDark ? "#000000" : "#FAF8F5" }}
      >
        
        {/* Subtle Background Glows */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none -z-10 transition-colors duration-500 ${
          isDark ? "bg-red-600/5" : "bg-red-500/10"
        }`} />

        {/* ─── Headline / Slogan Content Chunk ─── */}
        <Slogan textOpacity={textOpacity} textScale={textScale} isDark={isDark} />

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-48 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 pointer-events-none z-20"
        >
          <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold transition-colors duration-500 ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}>
            Scroll to revolve wheel
          </span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <MoveRight className="h-4 w-4" />
          </motion.div>
        </motion.div>

        {/* ─── Giant 360-Degree Revolving Wheel Chunk ─── */}
        <RevolvingWheel wheelRotation={wheelRotation} wheelY={wheelY} isDark={isDark} />
      </div>
    </div>
  );
}

export default LandingPage;
