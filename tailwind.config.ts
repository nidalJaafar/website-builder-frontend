import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          50: "#E9F9FF",
          100: "#CFF2FF",
          200: "#9FE5FF",
          300: "#6FD9FF",
          400: "#40CCFF",
          500: "#10BDF5",
          600: "#0A93C2",
          700: "#086E91",
          800: "#064A60",
          900: "#032530"
        }
      },
      boxShadow: {
        glow: "0 0 25px rgba(64, 204, 255, 0.45)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: []
};

export default config;
