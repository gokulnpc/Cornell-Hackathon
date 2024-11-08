/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#a78bfa", // Light purple
          DEFAULT: "#7c3aed", // Main purple
          dark: "#5b21b6", // Dark purple
        },
        gradientFrom: "#3b82f6",
        gradientVia: "#8b5cf6",
        gradientTo: "#ec4899",
      },
    },
  },
  plugins: [],
};
