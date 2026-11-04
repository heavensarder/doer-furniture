import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff4f0',
          100: '#ffe6dc',
          200: '#ffcfbe',
          300: '#ffad94',
          400: '#ff7a57',
          500: '#FF3D00', // DOER Website Primary Color
          600: '#eb3800',
          700: '#c52e00',
          800: '#9e2500',
          900: '#7a1d00',
          950: '#420b00',
          DEFAULT: '#FF3D00',
        },
        primary: {
          DEFAULT: '#FF3D00',
          hover: '#eb3800',
          light: '#fff4f0',
          dark: '#c52e00',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 35px -5px rgba(255, 61, 0, 0.45)',
        'glow-subtle': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'glow-card': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
        'architectural': '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};
export default config;
