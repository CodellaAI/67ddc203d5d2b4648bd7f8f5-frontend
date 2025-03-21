
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        dark: '#15202B',
        light: '#F7F9FA',
        'gray-dark': '#657786',
        'gray-light': '#AAB8C2',
        'gray-extra-light': '#E1E8ED',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
