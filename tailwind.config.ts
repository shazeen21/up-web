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
        home: {
          bg: "#EBE5DA",
          primary: "#670E10",
          text: "#670E10",
          secondary: "#EBE5DA",
        },
        uphaar: {
          bg: "#36794B",
          card: "#D9FFE5",
          cta: "#36794B",
          text: "#D9FFE5",
        },
        kyddoz: {
          bg: "#FF6A9E",
          card: "#FFB4CE",
          cta: "#FF6A9E",
          text: "#FFFFFF",
        },
        festive: {
          bg: "#8A8DB0",
          card: "#CACFFF",
          cta: "#8A8DB0",
          text: "#FFFFFF",
        },
        surface: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Playfair Display", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(15, 23, 42, 0.08)",
        card: "0 12px 45px rgba(17, 24, 39, 0.08)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
      },
      transitionTimingFunction: {
        "soft-spring": "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
