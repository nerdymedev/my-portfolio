import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#c23f1b',
        secondary: '#000000',
        accent: '#ff6b47',
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          green: '#00ff00',
          blue: '#0080ff',
          purple: '#8000ff',
          orange: '#ff8000',
          yellow: '#ffff00',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0a',
        },
        surface: {
          DEFAULT: '#f8f9fa',
          dark: '#111111',
        },
        text: {
          primary: {
            DEFAULT: '#1f2937',
            dark: '#f9fafb',
          },
          secondary: {
            DEFAULT: '#6b7280',
            dark: '#d1d5db',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
        'neon-flicker': 'neonFlicker 0.15s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        neonPulse: {
          '0%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff',
        'neon-pink': '0 0 5px #ff00ff, 0 0 20px #ff00ff, 0 0 35px #ff00ff',
        'neon-green': '0 0 5px #00ff00, 0 0 20px #00ff00, 0 0 35px #00ff00',
        'neon-blue': '0 0 5px #0080ff, 0 0 20px #0080ff, 0 0 35px #0080ff',
        'neon-purple': '0 0 5px #8000ff, 0 0 20px #8000ff, 0 0 35px #8000ff',
        'neon-orange': '0 0 5px #ff8000, 0 0 20px #ff8000, 0 0 35px #ff8000',
      },
    },
  },
  plugins: [],
}
export default config