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
        'base': '#FCFAF8',
        'main': '#2C2A29',
        'gold': '#C5A059',
        'sand': '#E5DFD3',
      },
      fontFamily: {
        'sans': ['"Noto Sans JP"', 'sans-serif'],
        'serif': ['"Shippori Mincho"', '"Noto Serif JP"', 'serif'],
      }
    },
  },
  plugins: [],
}

