import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fbf7ee",
          100: "#f5eccf",
          200: "#edd89d",
          300: "#e3be66",
          400: "#dba53b",
          500: "#c88a22",
          600: "#ab6b19",
          700: "#894e18",
          800: "#703f1a",
          900: "#5e3519",
          950: "#361b0a",
        },
        slate: {
          850: "#151b28",
          925: "#0c1017",
          950: "#080b11",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-light": "0 8px 30px rgba(0, 0, 0, 0.06)",
        glow: "0 0 35px -5px rgba(200, 138, 34, 0.3)",
        "glow-cyan": "0 0 35px -5px rgba(56, 189, 248, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
export default config;
