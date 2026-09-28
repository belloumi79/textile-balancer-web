import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6d5a',
          hover: '#ff826f',
        },
        dark: {
          bg: '#0b1020',
          panel: '#111827',
          card: '#182235',
          border: '#263244',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
