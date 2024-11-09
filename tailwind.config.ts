import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      jaro: ["Jaro", "sans-serif"],
      grace: ["Covered by your grace", "sans-serif"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        fadeOut: "fadeOut 1s ease-in-out forwards",
        logoDance: "logoDance 2s ease-in forwards",
        logoDebree: "logoDebree 2s ease-out forwards",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        logoDance: {
          "0%": { transform: "rotate(-4deg)" },
          "85%": { transform: "rotate(-3.5deg)" },
          "95%": { transform: "rotate(0deg)" },
        },
        logoDebree: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "88%": { transform: "scale(0)", opacity: "0" },
          "94%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
