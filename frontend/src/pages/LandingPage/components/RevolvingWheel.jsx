import { motion, useTransform } from "framer-motion";

const IMAGES = [
  { src: "/static/images/00000.webp", label: "Studio Look 01" },
  { src: "/static/images/female_00000.webp", label: "Studio Look 02" },
  { src: "/static/images/00001.webp", label: "Studio Look 03" },
  { src: "/static/images/female_00001.webp", label: "Studio Look 04" },
  { src: "/static/images/00002.webp", label: "Studio Look 05" },
  { src: "/static/images/female_00002.webp", label: "Studio Look 06" },
  { src: "/static/images/00003.webp", label: "Studio Look 07" },
  { src: "/static/images/female_00003.webp", label: "Studio Look 08" },
  { src: "/static/images/00004.webp", label: "Studio Look 09" },
  { src: "/static/images/female_00004.webp", label: "Studio Look 10" },
  { src: "/static/images/00005.webp", label: "Studio Look 11" },
  { src: "/static/images/female_00005.webp", label: "Studio Look 12" },
  { src: "/static/images/00006.webp", label: "Studio Look 13" },
  { src: "/static/images/female_00006.webp", label: "Studio Look 14" },
  { src: "/static/images/00007.webp", label: "Studio Look 15" },
  { src: "/static/images/female_00007.webp", label: "Studio Look 16" },
  { src: "/static/images/00008.webp", label: "Studio Look 17" },
  { src: "/static/images/female_00008.webp", label: "Studio Look 18" },
  { src: "/static/images/00009.webp", label: "Studio Look 19" },
  { src: "/static/images/female_00009.webp", label: "Studio Look 20" },
  { src: "/static/images/00010.webp", label: "Studio Look 21" },
  { src: "/static/images/female_00010.webp", label: "Studio Look 22" },
  { src: "/static/images/00011.webp", label: "Studio Look 23" },
  { src: "/static/images/female_00011.webp", label: "Studio Look 24" },
];

export default function RevolvingWheel({ wheelRotation, wheelY, scrollYProgress, isDark }) {
  // Brand name opacity fade on extreme scroll ends
  const brandOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.6, 1, 1, 0.7]);
  
  // Line animation path length: draws from top of screen to the center of the circle
  const linePathLength = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [0, 1, 1, 0]);

  // Flowing dash offset along the line to show data/outfit loading direction
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  // Fade out wheel as it reaches the end of the scroll container to prevent overlapping the header/footer
  const wheelOpacity = useTransform(scrollYProgress, [0, 0.8, 0.95, 1], [1, 1, 0, 0]);

  return (
    <div 
      className="absolute inset-0 w-full h-screen flex justify-center z-20 pointer-events-none overflow-hidden"
    >
      {/* Top gradient masking card entries */}
      <div
        className="absolute top-0 inset-x-0 h-24 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${
            isDark ? "#000000" : "#FAF8F5"
          } 0%, transparent 100%)`,
        }}
      />

      {/* ─── Animated Connection Line ─── */}
      <div className="absolute inset-x-0 top-0 h-full flex justify-center overflow-visible z-0 pointer-events-none">
        <svg
          className="w-8 h-full overflow-visible"
          viewBox="0 0 40 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background guide line */}
          <path
            d="M 20 0 L 20 600"
            stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Animated active path */}
          <motion.path
            d="M 20 0 L 20 600"
            stroke="url(#lineGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              pathLength: linePathLength,
              opacity: lineOpacity,
              strokeDasharray: "12, 8",
              strokeDashoffset: dashOffset
            }}
          />
        </svg>
      </div>

      {/* ─── Brand Logos in the center of the circle ─── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-700px", // -1600px (bottom of wheel) + 900px (center) = -700px
          y: wheelY,
          opacity: brandOpacity,
        }}
        className="flex flex-col items-center justify-center z-0 pointer-events-none gap-4 py-6"
      >
        <img
          src={isDark ? "/snitch-logo-light.png" : "/snitch-logo-dark.png"}
          alt="Snitch"
          className="h-64 md:h-[240px] w-auto object-contain select-none pointer-events-none transition-all duration-500"
        />
        <img
          src="/newmelight.png"
          alt="Newme"
          className="h-28 md:h-36 w-auto object-contain select-none pointer-events-none transition-all duration-500"
        />
        <span
          className={`text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase mt-2 transition-colors duration-500 ${
            isDark ? "text-zinc-500/80" : "text-zinc-400/80"
          }`}
        >
          Partner Catalogs
        </span>
      </motion.div>

      {/* The Revolving Wheel */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-1600px",
          width: "1800px",
          height: "1800px",
          rotate: wheelRotation,
          y: wheelY,
          opacity: wheelOpacity,
          transformOrigin: "center 900px",
        }}
        className="rounded-full flex justify-center pointer-events-auto"
      >
        {IMAGES.map((img, i) => {
          const angle = i * 15;
          return (
            <div
              key={img.src}
              style={{
                position: "absolute",
                top: 20,
                width: 200,
                height: 280,
                left: "calc(50% - 100px)",
                transformOrigin: "center 880px",
                transform: `rotate(${angle}deg)`,
              }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -18, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`w-full h-full rounded-[24px] overflow-hidden border shadow-2xl transition-all duration-500 cursor-pointer relative ${
                  isDark ? "border-white/[0.08] shadow-black/90 bg-zinc-900" : "border-zinc-200/80 shadow-zinc-300/40 bg-white"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-[11px] font-semibold text-white/80 tracking-wider uppercase">
                    {img.label}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
