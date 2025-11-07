/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base': {
          DEFAULT: '#071226',
          light: '#F9FAFB',
        },
        'accent-teal': '#00E6C3',
        'accent-violet': '#7A4DFF',
        'surface': {
          DEFAULT: '#1B2430',
          light: '#FFFFFF',
        },
        'danger': '#FF645A',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
