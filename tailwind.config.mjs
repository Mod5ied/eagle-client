/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cerulean: {
          DEFAULT: '#007BA7', // classic cerulean
          dark: '#005E7E',    // darker shade
          50: '#E1F7FF',
          100: '#B5EBFF',
          200: '#89DEFF',
          300: '#5DD2FF',
          400: '#31C6FF',
          500: '#07B9F7',
          600: '#009DCB',
          700: '#007BA7',
          800: '#005E7E',
          900: '#004256'
        }
      },
      backgroundImage: {
        'cerulean-gradient': 'linear-gradient(135deg, #007BA7 0%, #005E7E 60%, #004256 100%)'
      }
    },
  },
  plugins: [],
};
