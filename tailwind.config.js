/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0a0a0f",
        "surface-light": "#12121a",
        "surface-card": "#1a1a2e",
        primary: "#d946ef",
        secondary: "#22d3ee",
        accent: "#a855f7",
        "sev-critical": "#ef4444",
        "sev-high": "#f97316",
        "sev-medium": "#eab308",
        "sev-low": "#22c55e",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
