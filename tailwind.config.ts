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
        background: "var(--bg-primary)",
        card: "var(--bg-card)",
        surface: "var(--bg-surface)",
        subtle: "var(--bg-subtle)",
        ink: {
          DEFAULT: "var(--text-ink)",
          light: "var(--text-subtle)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "'Hiragino Sans'",
          "'Hiragino Kaku Gothic ProN'",
          "'Noto Sans JP'",
          "'Yu Gothic'",
          "Meiryo",
          "sans-serif",
        ],
        jp: [
          "'Noto Sans JP'",
          "'Hiragino Kaku Gothic ProN'",
          "'Yu Gothic'",
          "Meiryo",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        glow: "0 0 25px -5px var(--primary)",
      },
      animation: {
        "bounce-slight": "bounceSlight 2s infinite ease-in-out",
        "pulse-subtle": "pulseSubtle 3s infinite ease-in-out",
      },
      keyframes: {
        bounceSlight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
