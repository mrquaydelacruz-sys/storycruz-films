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
        background: "#0a0a0a", // Dark background
        offwhite: "#eaeaea",   // Soft white text
        accent: "#d4af37",     // Gold accent (example)
      },
      // ADD THIS SECTION:
      fontFamily: {
        serif: ["var(--font-serif)", "serif"], // Uses Playfair
        sans: ["var(--font-sans)", "sans-serif"], // Uses Lato
        cursive: ["var(--font-cursive)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;