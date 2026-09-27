/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060A14',
          900: '#0B1020',
          800: '#11182E',
        },
        surface: {
          dark: '#151C2C',
          card: '#1A2238',
          lighter: '#222D47',
          border: '#2A3654'
        },
        electric: {
          DEFAULT: '#3B82F6',
          glow: '#60A5FA',
          deep: '#2563EB',
        },
        neon: {
          green: '#39FF88',
          glow: 'rgba(57, 255, 136, 0.4)',
        },
        soft: {
          gray: '#94A3B8',
          light: '#CBD5E1',
          dim: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5)',
        'glow-neon': '0 0 25px -5px rgba(57, 255, 136, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
