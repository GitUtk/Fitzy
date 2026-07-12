import { motion } from "framer-motion";

export default function Slogan({ textOpacity, textScale, isDark }) {
  return (
    <div 
      className="relative z-0 w-full flex flex-col items-center justify-center text-center px-6"
      style={{ marginTop: "130px" }}
    >
      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="max-w-4xl space-y-4 sm:space-y-5"
      >
        <h1 
          style={{ color: isDark ? "#ffffff" : "#18181b" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] xl:text-[70px] font-black tracking-tight leading-[1.12] font-sans transition-colors duration-500"
        >
          We style wardrobes that are{" "}
          <span style={{ color: "#ef4444" }}>clear,<br />cohesive, and built to last.</span>
        </h1>

        <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-light transition-colors duration-500 ${
          isDark ? "text-zinc-400" : "text-zinc-600"
        }`}>
          Step into the world's most advanced AI-powered fitting room. Try on any catalog outfit instantly on your digital double.
        </p>
      </motion.div>
    </div>
  );
}
