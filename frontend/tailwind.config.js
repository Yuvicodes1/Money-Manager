/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* LIGHT MODE */
        lightBg: "#FEFFFE",
        lightText: "#0E0F19",
        lightMuted: "#66717E",
        lightAccent: "#DDA448",
        lightSecondary: "#480355",

        /* DARK MODE */
        darkBg: "#071108",
        darkCard: "#0F1A14",
        darkBorder: "#1C2A23",
        darkText: "#FBFAF8",
        darkAccent: "#2DD4BF"
      }
    },
  },
  plugins: [],
}
