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
        rosePink: "#F5A9B8", // Primary color
        goldenBeige: "#D4AF37", // Secondary/accent color
        ivoryWhite: "#FFF8F0", // Background/neutral color
        charcoal: "#333333",
        navyBlue: "#1A2526", // Primary color
        darkOrange: "#C2410C", // Secondary/accent color 1
        darkYellow: "#B45309", // Secondary/accent color 2
        softWhite: "#F5F5F5", // Text color // Text color
        darkPurple: "#4B0082",
        
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      
    },
  },
  plugins: [],
};
export default config;
