/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
ferro: {
  mint: '#D1D9D4',    // Sage base
  offwhite: '#F2F2F2',
  orange: '#FF6B00',  // The bright orange for NODE_02
  black: '#1A1A1A',   
  navy: '#2e3c51',    // The navy backdrop for the token
  grey: '#e2e8e4',    // The specific grey for the metric cards
}
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        'technical': '0.3em',
        'industrial': '0.1em',
      }
    },
  },
  plugins: [],
};