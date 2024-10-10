/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: '#1DB954',
        black: '#191414',
        white: '#FFFFFF',
        gray: {
          light: '#535353',
          dark: '#121212',
        },
      },
    },
  },
  plugins: [],
}
