/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'washi-base': '#F8F6F0',
        'sumi': '#2C2A29',
        'koubai': '#B85D6B',
        'light-brass': '#D1CEC5',
        'base': '#FDFDFD',
        'main': '#2C2A29',
        'gold': '#C5A059'
      },
      fontFamily: {
        'sans': ['"Noto Sans JP"', 'sans-serif'],
        'serif': ['"Noto Serif JP"', 'serif'],
      }
    },
  },
  plugins: [],
}

