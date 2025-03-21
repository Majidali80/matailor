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
        navy: {
          100: "#E6E9F0",
          200: "#B0B8CC",
          500: "#4B5EAA",
          600: "#3B4A8A",
          700: "#2C376A",
          800: "#1E254A",
          900: "#11142D",
        },
        amber: {
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        myDgold:"#ED9B33",
			myLgold:"#F1B434",
			myBkack:"#111011",
			myLblack:"#101820",
			myBlue:"#2536be",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
