/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores del logo mixxo
        mixxo: {
          pink: {
            50: '#FCE4EC',
            100: '#F8BBD0',
            200: '#F48FB1',
            300: '#F06292',
            400: '#EC407A',
            500: '#E91E63', // Principal rosa
            600: '#D81B60',
            700: '#C2185B',
            800: '#AD1457',
            900: '#880E4F',
          },
          cyan: {
            50: '#E0F7FA',
            100: '#B2EBF2',
            200: '#80DEEA',
            300: '#4DD0E1',
            400: '#26C6DA',
            500: '#00BCD4', // Principal cyan
            600: '#00ACC1',
            700: '#0097A7',
            800: '#00838F',
            900: '#006064',
            bright: '#00E5FF', // Cyan brillante
          },
          purple: {
            50: '#F3E5F5',
            100: '#E1BEE7',
            200: '#CE93D8',
            300: '#BA68C8',
            400: '#AB47BC',
            500: '#9C27B0', // Principal púrpura
            600: '#8E24AA',
            700: '#7B1FA2',
            800: '#6A1B9A',
            900: '#4A148C',
          }
        }
      },
      backgroundImage: {
        'gradient-mixxo': 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #00BCD4 100%)',
        'gradient-mixxo-reverse': 'linear-gradient(135deg, #00BCD4 0%, #9C27B0 50%, #E91E63 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #00BCD4 0%, #9C27B0 100%)',
        'gradient-pink-cyan': 'linear-gradient(135deg, #E91E63 0%, #00E5FF 100%)',
      },
      boxShadow: {
        'mixxo': '0 10px 40px -10px rgba(233, 30, 99, 0.4)',
        'mixxo-lg': '0 20px 60px -15px rgba(233, 30, 99, 0.5)',
        'cyan': '0 10px 40px -10px rgba(0, 188, 212, 0.4)',
        'cyan-lg': '0 20px 60px -15px rgba(0, 188, 212, 0.5)',
        'purple': '0 10px 40px -10px rgba(156, 39, 176, 0.4)',
        'purple-lg': '0 20px 60px -15px rgba(156, 39, 176, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(233, 30, 99, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(233, 30, 99, 0.8), 0 0 60px rgba(0, 188, 212, 0.5)' 
          },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
