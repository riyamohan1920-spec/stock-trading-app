/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#00b386',
          600: '#00997a',
          700: '#00805f',
          900: '#004d38',
        },
        dark: {
          50: '#f8fafc',
          100: '#1e2130',
          200: '#181c2a',
          300: '#141824',
          400: '#0f1219',
          500: '#0a0d14',
        },
        accent: '#ff6b35',
        profit: '#00c278',
        loss: '#eb5757',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
