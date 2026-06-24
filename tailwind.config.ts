import type { Config } from 'tailwindcss';

/**
 * Eastern palette:
 *  - "rice paper" warm cream tones for light mode (washi, mist, gold leaf)
 *  - "sumi ink" deep tones for dark mode (ink-wash night, lantern gold)
 *  - "cinnabar" vermilion + "jade" green as the signature accents
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rice: {
          50: '#fbf8f1',
          100: '#f5efe2',
          200: '#ece1c9',
          300: '#dccaa6',
          400: '#c9b184',
          500: '#b89a64',
        },
        sumi: {
          700: '#20242e',
          800: '#171a22',
          900: '#0f1117',
          950: '#090a0f',
        },
        cinnabar: {
          300: '#e98a6f',
          400: '#df6244',
          500: '#c8432a',
          600: '#a63420',
        },
        jade: {
          300: '#8fc7a6',
          400: '#5fa97f',
          500: '#3f8a60',
          600: '#2f6b49',
        },
        gold: {
          300: '#e8c87a',
          400: '#d9ad4f',
          500: '#c2922f',
          600: '#a3771f',
        },
        ink: '#1c1a17',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        brush: ['var(--font-brush)', 'cursive'],
      },
      boxShadow: {
        scroll: '0 24px 48px -16px rgb(0 0 0 / 0.35)',
        card: '0 8px 30px rgb(0 0 0 / 0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'fade-in': 'fadeIn 1s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
