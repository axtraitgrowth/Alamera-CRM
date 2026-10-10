import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alamera: {
          red: "#EE1C25",
          redDark: "#C4121A",
          redLight: "#FF3842",
          redSubtle: "rgba(238, 28, 37, 0.12)",
          black: "#0A0B0D",
          dark: "#101114",
          darkest: "#070809",
          card: "#16181E",
          cardLight: "#1E2028",
          border: "#282B35",
          borderLight: "#373A48",
          muted: "#888F9E",
          silver: "#CAD0DB",
          light: "#E5E7EB",
          white: "#FFFFFF",
          cream: "#EDE7DC",
          platinum: "#F4F5F7",
        },
        champagne: {
          50: '#FAF7F2',
          100: '#F4EBD9',
          200: '#E8D7B8',
          300: '#DAC297',
          400: '#CCA973',
          500: '#C4A476',
          600: '#A88756',
          700: '#8C6C3E',
          800: '#69512E',
          900: '#46361F',
        },
      },
      fontFamily: {
        serif: ["Prata", "Cinzel", "Playfair Display", "serif"],
        sans: ["DM Sans", "Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        widestLuxe: "0.20em",
        superLuxe: "0.28em",
      },
      boxShadow: {
        alameraRed: "0 0 20px -3px rgba(238, 28, 37, 0.35)",
        alameraCard: "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        cardInner: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        luxe: "0 12px 40px -10px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
