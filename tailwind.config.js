/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        secondary: "#3B82F6",
        accent: "#F59E0B",
        brand: {
          orange: "#FF5528",
          dark: "#343434",
          gray: "#727272",
        },
      },
      fontFamily: {
        serif: ["var(--font-libre)", "serif"],
      },
    },
  },
  plugins: [],
};
