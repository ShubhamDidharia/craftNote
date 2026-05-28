/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#F8F9FA',
        'bg-surface': '#FFFFFF',
        'text-primary': '#212529',
        'text-secondary': '#495057',
        'accent': '#9E1B32',
        'highlight': '#D4AF37',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
