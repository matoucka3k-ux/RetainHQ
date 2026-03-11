import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        bg: '#080c14',
        surface: '#111827',
        border: '#1e2d45',
        blue: {
          DEFAULT: '#3b82f6',
          bright: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
}
export default config
