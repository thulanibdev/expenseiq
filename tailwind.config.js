/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: '#6366f1',
        'brand-light': '#818cf8',
        'brand-pale': '#eef2ff',
        success: '#10b981',
        'success-pale': '#d1fae5',
        danger: '#ef4444',
        'danger-pale': '#fee2e2',
        warning: '#f59e0b',
        'warning-pale': '#fef3c7',
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e1e2e',
        },
        bg: {
          DEFAULT: '#f8f7ff',
          dark: '#13131f',
        },
        border: {
          DEFAULT: '#e8e6f0',
          dark: '#2a2a3e',
        },
        muted: '#8b8aa0',
      },
    },
  },
  plugins: [],
}
