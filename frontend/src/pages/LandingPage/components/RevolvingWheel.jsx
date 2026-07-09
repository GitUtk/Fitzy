import { motion } from "framer-motion";

const IMAGES = [
  { src: "/static/images/00000.webp", label: "Studio Look 01" },
  { src: "/static/images/00001.webp", label: "Studio Look 02" },
  { src: "/static/images/00002.webp", label: "Studio Look 03" },
  { src: "/static/images/00003.webp", label: "Studio Look 04" },
  { src: "/static/images/00004.webp", label: "Studio Look 05" },
  { src: "/static/images/00005.webp", label: "Studio Look 06" },
  { src: "/static/images/00006.webp", label: "Studio Look 07" },
  { src: "/static/images/00007.webp", label: "Studio Look 08" },
  { src: "/static/images/00008.webp", label: "Studio Look 09" },
  { src: "/static/images/00009.webp", label: "Studio Look 10" },
  { src: "/static/images/00010.webp", label: "Studio Look 11" },
  { src: "/static/images/00011.webp", label: "Studio Look 12" },
  { src: "/static/images/00012.webp", label: "Studio Look 13" },
  { src: "/static/images/00013.webp", label: "Studio Look 14" },
  { src: "/static/images/00014.webp", label: "Studio Look 15" },
  { src: "/static/images/00015.webp", label: "Studio Look 16" },
  { src: "/static/images/00016.webp", label: "Studio Look 17" },
  { src: "/static/images/00017.webp", label: "Studio Look 18" },
  { src: "/static/images/00018.webp", label: "Studio Look 19" },
  { src: "/static/images/00019.webp", label: "Studio Look 20" },
  { src: "/static/images/00020.webp", label: "Studio Look 21" },
  { src: "/static/images/00021.webp", label: "Studio Look 22" },
  { src: "/static/images/00022.webp", label: "Studio Look 23" },
  { src: "/static/images/00023.webp", label: "Studio Look 24" },
];

export default function RevolvingWheel({ wheelRotation, wheelY, isDark }) {
  return (
    <div 
      className="absolute inset-x-0 bottom-0 w-full flex justify-center z-10 pointer-events-none"
      style={{ height: "480px" }}
    >
      {/* Top gradient masking card entries — uses inline style so it syncs with parent */}
      <div
        className="absolute top-0 inset-x-0 h-24 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${
            isDark ? "#000000" : "#FAF8F5"
          } 0%, transparent 100%)`,
        }}
      />

      {/* The Revolving Wheel (Axis fixed outside screen at bottom: -1600px) */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-1600px",
          width: "1800px",
          height: "1800px",
          rotate: wheelRotation,
          y: wheelY,
          transformOrigin: "center 900px",
        }}
        className="rounded-full flex justify-center pointer-events-auto"
      >
        {IMAGES.map((img, i) => {
          // Position cards at 15-degree increments all around the 360-degree circle (24 images)
          const angle = i * 15;
          return (
            <div
              key={img.src}
              style={{
                position: "absolute",
                top: 20,
                width: 200,
                height: 280,
                left: "calc(50% - 100px)", // FIX: force perfect centering relative to parent container on any screen width
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
