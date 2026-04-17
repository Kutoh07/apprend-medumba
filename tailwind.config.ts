import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        medumba: ['var(--font-noto-sans)', '"Noto Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#1B4F72',
        secondary: '#F39C12',
        accent: '#27AE60',
        background: '#FAFAFA',
        foreground: '#333333',
      },
    },
  },
  plugins: [],
}
export default config
