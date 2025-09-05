/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode via class on <html>
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // React/Vite files
    './public/index.html'         // Entry HTML
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',       // Tailwind blue-800
        accent: '#f59e0b',        // Tailwind amber-500
        'musta-purple': '#7c3aed',
        'musta-dark': '#5b21b6',
        'musta-bg': '#f9f5ff',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        scaleUp: 'scaleUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};