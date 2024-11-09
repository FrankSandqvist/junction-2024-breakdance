import { transform } from "next/dist/build/swc/generated-native";
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
    },
    extend: {
      colors: {
        darkBlue: "#0e083a",
        primary: "#ffe922",
        secondary: "#ff22c6",
      },
      animation: {
        fadeOut: "fadeOut 1s ease-in-out forwards",
        logoDance: "logoDance 2s ease-in forwards",
        logoDebree: "logoDebree 2s ease-out forwards",
        pulseBigSmall: "pulseBigSmall 1s ease-in-out infinite",
        actionTextAppear1:
          "actionTextAppear1 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        actionTextAppear2:
          "actionTextAppear2 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        actionTextAppear3:
          "actionTextAppear3 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
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
        pulseBigSmall: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
