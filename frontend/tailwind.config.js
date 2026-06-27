// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Purple / Lime Palette */
        "primary": "#7C3AED",
        "primary-light": "#A78BFA",
        "primary-dark": "#5B21B6",
        "primary-container": "#2E1065",
        "accent": "#CCFF00",
        "accent-dark": "#A3CC00",

        /* Surfaces */
        "surface": "#0F0B1A",
        "surface-light": "#1A1528",
        "surface-card": "#1E1833",
        "surface-container-low": "#150F24",
        "surface-container-high": "#2A2340",

        /* Text */
        "on-surface": "#F5F3FF",
        "on-surface-variant": "#A78BFA",
        "on-background": "#F5F3FF",

        /* Borders */
        "outline-black": "#7C3AED",
        "outline-subtle": "#3B2D5E",

        /* Secondary */
        "secondary": "#A78BFA",
        "secondary-container": "#2E1065",

        /* Status */
        "success": "#22C55E",
        "danger": "#EF4444",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "full": "9999px",
      },
      spacing: {
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "40px",
        "xl": "64px",
        "base": "4px",
        "margin": "32px",
      },
      fontFamily: {
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-bold": ["Hanken Grotesk", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "brutal": "4px 4px 0px 0px #7C3AED",
        "brutal-lg": "6px 6px 0px 0px #7C3AED",
        "brutal-lime": "4px 4px 0px 0px #CCFF00",
        "brutal-lime-lg": "6px 6px 0px 0px #CCFF00",
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-lime": "0 0 20px rgba(204, 255, 0, 0.3)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
