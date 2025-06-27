import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        darkGreen: "#2e3330",
        gray: {
          400: "#9ca3af",
          500: "#7b857e",
          600: "#65726f",
          700: "#5f6761",
          800: "#4b5563",
        },
        teal: "#9eb8bb",
        brown: {
          DEFAULT: "#b17134",
          light: "#d68c37",
        },
        white: {
          100: "#f9fafb",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#ced4da",
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        lora: ['Lora', 'serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}