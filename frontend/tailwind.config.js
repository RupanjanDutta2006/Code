/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F6F7F9',
          surface: '#FFFFFF',
          secondary: '#F8FAFC',
          border: '#E5E9F0',
          borderStrong: '#D8DEE8',
          borderSubtle: '#EEF0F4',
          textStrong: '#1D2433',
          textNormal: '#35363D',
          textSecondary: '#667085',
          textMuted: '#98A2B3',
          blue: '#2D6ED1',
          blueHover: '#245CBD',
          blueSoft: '#EEF5FF',
          blueBorder: '#65A1EF',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff4d5a', // Primary vibrant crimson red
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        dark: {
          950: '#060608', // Deep pitch black
          900: '#0a0a0d', // Ultra deep charcoal
          850: '#111115', // Dark glass backdrop
          800: '#17171d', // Elevated panel
          750: '#202028', // Border / subtle highlight
          700: '#2a2a34', // Divider
          600: '#3d3d4b',
          500: '#585868',
          400: '#8a8a9a',
          300: '#b8b8c8',
          200: '#dcdce5',
          100: '#f2f2f8',
        },
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff4d5a',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        neon: {
          red: '#ff334b',
          crimson: '#ff4d5a',
          ruby: '#e11d48',
          blue: '#3412fd',
          purple: '#880acc',
          cyan: '#00f0ff',
          pink: '#ff007a',
          violet: '#7928ca',
          indigo: '#5b21b6',
        },
        accent: {
          red: '#ff4d5a',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(16, 24, 40, 0.04), 0 1px 2px rgba(16, 24, 40, 0.03)',
        'card-light': '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
        'card-hover-light': '0 8px 24px -4px rgba(16, 24, 40, 0.08), 0 2px 6px -1px rgba(16, 24, 40, 0.04)',
        'glow-red': '0 0 25px -4px rgba(255, 77, 90, 0.45)',
        'glow-red-lg': '0 0 45px -8px rgba(255, 77, 90, 0.35)',
        'glow-red-sm': '0 0 14px -2px rgba(255, 77, 90, 0.5)',
        'neon-blue': '0 0 25px -4px rgba(52, 18, 253, 0.45)',
        'neon-purple': '0 0 25px -4px rgba(136, 10, 204, 0.45)',
        'neon-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.35)',
        'glass-card': '0 16px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-hover': '0 20px 48px -10px rgba(255, 77, 90, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'aurora-slow': 'auroraSlow 16s ease-in-out infinite alternate',
        'aurora-float': 'auroraFloat 22s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        auroraSlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: '0.25' },
          '50%': { transform: 'translate(40px, -30px) scale(1.15)', opacity: '0.45' },
          '100%': { transform: 'translate(-30px, 20px) scale(0.95)', opacity: '0.3' },
        },
        auroraFloat: {
          '0%': { transform: 'rotate(0deg) translate(0px, 0px) scale(1)' },
          '33%': { transform: 'rotate(120deg) translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'rotate(240deg) translate(-30px, 20px) scale(0.95)' },
          '100%': { transform: 'rotate(360deg) translate(0px, 0px) scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
