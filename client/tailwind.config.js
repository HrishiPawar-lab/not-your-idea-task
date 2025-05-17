/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          dark: '#556B2F',
          light: '#6B8E23',
        },
        'background-color': '#f8f6f5',
        accent: '#8FBC8F',
        'soft-black': '#1C1C1C',
        'near-black': '#111111',
        'off-white': '#F5F5F5',
      }
    }
  },
  plugins: [],
}