import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B1538",
        accent: "#D4AF37",
      },
    },
  },
  plugins: [],
};

export default config;
