/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature-inspired palette
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669', // Emerald Green (Main Brand Color)
          700: '#047857',
        },
        earth: {
          100: '#f5f5f4', // Warm background
          800: '#44403c', // Dark text
        }
      }
    },
  },
  plugins: [],
}