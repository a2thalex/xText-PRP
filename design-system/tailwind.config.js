/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./patterns/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0056e0',
          600: '#0047b8',
          700: '#003890',
          800: '#002968',
          900: '#001a40'
        },
        gray: {
          50: '#f7f9fc',
          100: '#e9ecf2',
          200: '#d3d9e4',
          300: '#a8b3c7',
          400: '#7d8ca5',
          500: '#5a6881',
          600: '#454f63',
          700: '#2e3749',
          800: '#1a2030',
          900: '#0d1117'
        },
        success: {
          light: '#4ade80',
          main: '#22c55e',
          dark: '#16a34a'
        },
        warning: {
          light: '#fbbf24',
          main: '#f59e0b',
          dark: '#d97706'
        },
        error: {
          light: '#f87171',
          main: '#ef4444',
          dark: '#dc2626'
        },
        info: {
          light: '#60a5fa',
          main: '#3b82f6',
          dark: '#2563eb'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        }
      }
    }
  },
  plugins: []
}