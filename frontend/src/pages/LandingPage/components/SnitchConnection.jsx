import { motion, useTransform } from "framer-motion";

export default function SnitchConnection({ scrollYProgress, isDark }) {
  // Snitch logo fade and scale choreography (no card background)
  const logoOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.45, 0.55], [0, 1, 1, 0]);
  const logoScale = useTransform(scrollYProgress, [0.05, 0.2, 0.45, 0.55], [0.8, 1, 1, 0.8]);
  const logoY = useTransform(scrollYProgress, [0.05, 0.2, 0.45, 0.55], [30, 0, 0, -30]);

  // Line animation path length: draws from logo to the wheel
  const linePathLength = useTransform(scrollYProgress, [0.2, 0.42], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);

  // Pulsing / flowing dash offset to show motion along the line
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  const logoSrc = isDark ? "/snitch-logo-light.png" : "/snitch-logo-dark.png";

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start z-20">
      {/* ─── Snitch Logo & Brand (No card wrapper) ─── */}
      <motion.div
        style={{
          opacity: logoOpacity,
          scale: logoScale,
          y: logoY,
          marginTop: "300px"
        }}
        className="flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-3 bg-red-500/10 text-red-500">
          Catalog Partner
        </div>
        
        {/* Snitch Logo */}
        <div className="h-10 flex items-center justify-center mb-2">
          <img
            src={logoSrc}
            alt="Snitch Logo"
            className="h-full object-contain max-w-[160px] filter drop-shadow-md select-none pointer-events-none"
          />
        </div>

        <p className={`text-[11px] font-medium tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Curating the best outfits for you
        </p>
      </motion.div>

      {/* ─── Animated Connection Line ─── */}
      <div className="relative w-full flex-grow flex justify-center overflow-visible" style={{ height: "450px" }}>
        <svg
          className="absolute top-0 w-32 h-[400px] overflow-visible"
          viewBox="0 0 120 400"
          fill="none"
          style={{ marginTop: "420px" }} // Positioned right below the logo
        >
          <defs>
            <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background guide line */}
          <path
            d="M 60 0 C 60 100, 60 150, 60 300"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Animated active path */}
          <motion.path
            d="M 60 0 C 60 100, 60 150, 60 300"
            stroke="url(#glowGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              pathLength: linePathLength,
              opacity: lineOpacity,
              strokeDasharray: "15, 10",
              strokeDashoffset: dashOffset
            }}
          />

          {/* Pulsing signal dot that rides the line */}
          <motion.circle
            r="4.5"
            fill="#ef4444"
            style={{
              opacity: lineOpacity,
            }}
            className="shadow-lg shadow-red-500/50"
          >
            <animateMotion
              path="M 60 0 C 60 100, 60 150, 60 300"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </svg>
      </div>
    </div>
  );
}
