/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pinkred: '#F8395A',
        blue: '#24355A',
        lightgrey: '#F7F8F8',
        grey: '#bdb9b9',
        darkgrey: '#969393',
      },
      boxShadow: {
        custom: '0 3px 10px 2px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'custom': '10px',
      },
    },
  },
  plugins: [],
}