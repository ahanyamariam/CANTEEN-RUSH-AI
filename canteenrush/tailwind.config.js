/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          light: '#A29BFE',
          dark: '#4834D4',
          50: '#F0EEFF',
          100: '#DDD9FE',
          200: '#BBB3FD',
          500: '#6C5CE7',
          600: '#5A4BD1',
          700: '#4834D4',
          900: '#2D1F8A',
        },
        accent: {
          DEFAULT: '#FF6B6B',
          light: '#FF8E8E',
          dark: '#EE5A24',
          50: '#FFF0F0',
        },
        mint: {
          DEFAULT: '#00D2D3',
          light: '#7EFADB',
          dark: '#01A3A4',
          50: '#E8FFFE',
        },
        sunny: {
          DEFAULT: '#FECA57',
          light: '#FFF3BF',
          dark: '#F0932B',
          50: '#FFFBEB',
        },
        coral: {
          DEFAULT: '#FF9FF3',
          light: '#FFDDF4',
          dark: '#F368E0',
        },
        surface: {
          DEFAULT: '#F8F9FE',
          dark: '#1A1A2E',
        },
        success: '#00B894',
        danger: '#FF6B6B',
        warning: '#FDCB6E',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(108, 92, 231, 0.3)',
        'glow-accent': '0 0 40px rgba(255, 107, 107, 0.3)',
        'glow-mint': '0 0 40px rgba(0, 210, 211, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'float': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};