/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          primary: '#10B981', // Green
          secondary: '#3B82F6', // Blue
          accent: '#059669',
          light: '#D1FAE5',
          dark: '#064E3B'
        }
      },
      fontFamily: {
        'health': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}