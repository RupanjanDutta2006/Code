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
        dark: {
          950: '#040308', // Deepest OkyAi obsidian black
          900: '#080a14', // Deep navy black
          850: '#0e1222', // Card backdrop
          800: '#141a2e', // Elevated panel
          750: '#1b223c', // Border / subtle highlight
          700: '#232b4b', // Inset / Divider
          600: '#333d66',
          500: '#52608f',
          400: '#8f97a6',
          300: '#b8c0cc',
          200: '#d0d3d8',
          100: '#f1f4f9',
        },
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#241a8a',
          900: '#1e1470',
        },
        neon: {
          blue: '#3412fd',
          purple: '#880acc',
          cyan: '#00f0ff',
          pink: '#ff007a',
          violet: '#7928ca',
          indigo: '#5b21b6',
        },
        accent: {
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
        'neon-blue': '0 0 25px -4px rgba(52, 18, 253, 0.45)',
        'neon-purple': '0 0 25px -4px rgba(136, 10, 204, 0.45)',
        'neon-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.35)',
        'glass-card': '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 24px 48px -12px rgba(136, 10, 204, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
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
      }
    },
  },
  plugins: [],
}
