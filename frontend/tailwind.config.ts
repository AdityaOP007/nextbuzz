import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ["var(--ff-head)", "Georgia", "serif"],
        body: ["var(--ff-body)", "sans-serif"],
      },
      colors: {
        nb: {
          bg: "var(--bg)",
          bg2: "var(--bg2)",
          bg3: "var(--bg3)",
          card: "var(--card)",
          border: "var(--border)",
          orange: "var(--orange)",
          gold: "var(--gold)",
          rose: "var(--rose)",
          purple: "var(--purple)",
          teal: "var(--teal)",
          white: "var(--white)",
          muted: "var(--muted)",
        },
      },
      borderRadius: {
        nb: "var(--radius)",
        "nb-sm": "var(--r-sm)",
      },
      boxShadow: {
        nb: "var(--shadow)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
