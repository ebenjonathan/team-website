import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#09947d',
          dark: '#07705e',
          deeper: '#172624',
          light: '#f7fbfa',
          muted: '#e8f5f2',
        },
        body: '#444444',
      },
      fontFamily: {
        // Open Sans is the primary body font across all elements
        sans: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
        // Montserrat used only for display headings (font-heading class)
        heading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        // Roboto available as utility class font-roboto if needed
        roboto: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
        nav: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { xl: '1280px', '2xl': '1280px' },
      },
    },
  },
  plugins: [],
}

export default config
