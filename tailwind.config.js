/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        lightbg: "#EAF4EC",
        darktext: "#1A202C",
      },
    },
  },
  plugins: [],
}