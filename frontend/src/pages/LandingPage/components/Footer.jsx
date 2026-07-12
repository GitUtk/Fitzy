import { FaGithub } from "react-icons/fa";

export default function Footer({ isDark }) {
  return (
    <footer
      className={`relative w-full h-[60vh] flex flex-col justify-between items-center px-8 py-12 border-t overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-black border-white/[0.05] text-zinc-500"
          : "bg-zinc-50 border-zinc-200/80 text-zinc-400"
      }`}
    >
      {/* Background Decorative Pattern */}
      <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${
        isDark ? "bg-[radial-gradient(#ffffff_1px,transparent_1px)]" : "bg-[radial-gradient(#000000_1px,transparent_1px)]"
      }`} style={{ backgroundSize: "24px 24px" }} />

      <div /> {/* Spacer */}

      {/* ─── Giant ASCII Art ─── */}
      <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <pre className="text-[1.8vw] md:text-[1.2vw] lg:text-[14px] font-mono leading-none font-bold tracking-tight mb-6">
          {isDark ? (
            <>
              <span className="text-white">███████╗██╗████████╗███████╗</span><span className="text-red-500">██╗   ██╗</span>{"\n"}
              <span className="text-white">██╔════╝██║╚══██╔══╝╚══███╔╝</span><span className="text-red-500">╚██╗ ██╔╝</span>{"\n"}
              <span className="text-white">█████╗  ██║   ██║     ███╔╝ </span><span className="text-red-500"> ╚████╔╝ </span>{"\n"}
              <span className="text-white">██╔══╝  ██║   ██║    ███╔╝  </span><span className="text-red-500">  ╚██╔╝  </span>{"\n"}
              <span className="text-white">██║     ██║   ██║   ███████╗</span><span className="text-red-500">   ██║   </span>{"\n"}
              <span className="text-white">╚═╝     ╚═╝   ╚═╝   ╚══════╝</span><span className="text-red-500">   ╚═╝   </span>
            </>
          ) : (
            <>
              <span className="text-zinc-950">███████╗██╗████████╗███████╗</span><span className="text-red-500">██╗   ██╗</span>{"\n"}
              <span className="text-zinc-950">██╔════╝██║╚══██╔══╝╚══███╔╝</span><span className="text-red-500">╚██╗ ██╔╝</span>{"\n"}
              <span className="text-zinc-950">█████╗  ██║   ██║     ███╔╝ </span><span className="text-red-500"> ╚████╔╝ </span>{"\n"}
              <span className="text-zinc-950">██╔══╝  ██║   ██║    ███╔╝  </span><span className="text-red-500">  ╚██╔╝  </span>{"\n"}
              <span className="text-zinc-950">██║     ██║   ██║   ███████╗</span><span className="text-red-500">   ██║   </span>{"\n"}
              <span className="text-zinc-950">╚═╝     ╚═╝   ╚═╝   ╚══════╝</span><span className="text-red-500">   ╚═╝   </span>
            </>
          )}
        </pre>

        <span className={`text-[10px] tracking-[0.4em] font-bold uppercase ${
          isDark ? "text-zinc-500" : "text-zinc-400"
        }`}>
          AI Fashion & Fitting Room
        </span>
      </div>

      {/* ─── Links and Copyright ─── */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-8 border-t border-inherit pt-8 z-10">
        
        {/* Left Side: Overlapping Contributors Avatars */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
            Contributors:
          </span>
          <div className="flex items-center -space-x-2.5 overflow-hidden p-0.5">
            {/* Contributor 1 */}
            <a
              href="https://github.com/GitUtk"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block hover:z-30 transition-transform hover:scale-110"
              title="GitUtk Utkarsh (@GitUtk)"
            >
              <img
                src="https://github.com/GitUtk.png"
                alt="GitUtk Utkarsh"
                className={`w-8 h-8 rounded-full border-2 object-cover ring-1 ring-transparent ${
                  isDark ? "border-zinc-950 bg-zinc-900" : "border-white bg-zinc-100"
                }`}
              />
            </a>

            {/* Contributor 2 */}
            <a
              href="https://github.com/yashikakataria003-dotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block hover:z-30 transition-transform hover:scale-110"
              title="yashikakataria003-dotcom (@yashikakataria003-dotcom)"
            >
              <img
                src="https://github.com/yashikakataria003-dotcom.png"
                alt="yashikakataria003-dotcom"
                className={`w-8 h-8 rounded-full border-2 object-cover ring-1 ring-transparent ${
                  isDark ? "border-zinc-950 bg-zinc-900" : "border-white bg-zinc-100"
                }`}
              />
            </a>

            {/* Contributor 3 */}
            <a
              href="https://github.com/Akshita-bansal13"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block hover:z-30 transition-transform hover:scale-110"
              title="Akshita-bansal13 (@Akshita-bansal13)"
            >
              <img
                src="https://github.com/Akshita-bansal13.png"
                alt="Akshita-bansal13"
                className={`w-8 h-8 rounded-full border-2 object-cover ring-1 ring-transparent ${
                  isDark ? "border-zinc-950 bg-zinc-900" : "border-white bg-zinc-100"
                }`}
              />
            </a>
          </div>
        </div>

        {/* Right Side: Links */}
        <div className="flex items-center gap-8 font-semibold">
          <a
            href="https://github.com/GitUtk/Fitzy/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-red-500 transition-colors flex items-center ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
            aria-label="GitHub Repository"
          >
            <FaGithub className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
