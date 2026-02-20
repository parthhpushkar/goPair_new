/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e8ff',
          300: '#89dbff',
          400: '#51c5ff',
          500: '#29a7ff',
          600: '#1189f5',
          700: '#0a6fe1',
          800: '#0f5ab6',
          900: '#134d8f',
          950: '#0f3057',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        dark: {
          50: '#f6f6f9',
          100: '#ececf2',
          200: '#d5d5e2',
          300: '#b0b0c9',
          400: '#8686ab',
          500: '#676791',
          600: '#535278',
          700: '#444362',
          800: '#3b3a53',
          900: '#343347',
          950: '#0d0d15',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f3057 0%, #1a1a3e 40%, #2d1b69 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.5)',
        'neon': '0 0 20px rgba(41, 167, 255, 0.3), 0 0 40px rgba(41, 167, 255, 0.1)',
        'neon-accent': '0 0 20px rgba(217, 70, 239, 0.3), 0 0 40px rgba(217, 70, 239, 0.1)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(41, 167, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(41, 167, 255, 0.6), 0 0 80px rgba(41, 167, 255, 0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
