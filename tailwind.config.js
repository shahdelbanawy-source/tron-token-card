/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tron: {
          primary: '#f7931a',
          dark: '#0a0e27',
          light: '#f5f5f5',
        },
      },
    },
  },
  plugins: [],
}
