/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"]
      },
      colors: {
        primary: "hsl(259, 100%, 65%)",
        secondary: "hsl(0, 100%, 67%)",

        neutral: {
          100: "hsl(0, 0%, 94%)",
          200: "hsl(0, 0%, 86%)",
          300: "hsl(0, 1%, 44%)",
          400: " hsl(0, 0%, 8%)"
        }
      }
    },
  },
  plugins: [],
}

