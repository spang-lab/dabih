import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      green: '#059669',
      blue: '#145D76',
      orange: '#ea580c',
      white: '#ffffff',
      black: '#000000',
      red: '#be123c',
      transparent: 'transparent',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'spin-reverse': 'reverseSpin 1s linear infinite',
        upload: 'shadowRollingUp 2s linear infinite',
        download: 'shadowRollingDown 2s linear infinite',
        shaking: 'shaking 0.2s linear 2',
      },
      keyframes: {
        shaking: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-1deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        reverseSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        shadowRollingUp: {
          '0%': {
            boxShadow: '0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
          '12%': {
            boxShadow: '0 -200px theme(colors.blue), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
          '25%': {
            boxShadow: '0 -220px theme(colors.blue), 0 -200px theme(colors.blue), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
          '36%': {
            boxShadow: '0 -240px theme(colors.blue), 0 -220px theme(colors.blue), 0 -200px theme(colors.blue), 0 0px theme(colors.transparent)',
          },
          '50%': {
            boxShadow: '0 -260px theme(colors.blue), 0 -240px theme(colors.blue), 0 -220px theme(colors.blue), 0 -200px theme(colors.blue)',
          },
          '62%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -260px theme(colors.blue), 0 -240px theme(colors.blue), 0 -220px theme(colors.blue)',
          },
          '75%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -260px theme(colors.blue), 0 -240px theme(colors.blue)',
          },
          '87%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -260px theme(colors.blue)',
          },
          '100%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent)',
          },
        },
        shadowRollingDown: {
          '0%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent)',
          },
          '12%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -260px theme(colors.blue)',
          },
          '25%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -400px theme(colors.transparent), 0 -260px theme(colors.blue), 0 -240px theme(colors.blue)',
          },
          '36%': {
            boxShadow: '0 -400px theme(colors.transparent), 0 -260px theme(colors.blue), 0 -240px theme(colors.blue), 0 -220px theme(colors.blue)',
          },
          '50%': {
            boxShadow: '0 -260px theme(colors.blue), 0 -240px theme(colors.blue), 0 -220px theme(colors.blue), 0 -200px theme(colors.blue)',
          },
          '62%': {
            boxShadow: '0 -240px theme(colors.blue), 0 -220px theme(colors.blue), 0 -200px theme(colors.blue), 0 0px theme(colors.transparent)',
          },
          '75%': {
            boxShadow: '0 -220px theme(colors.blue), 0 -200px theme(colors.blue), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
          '87%': {
            boxShadow: '0 -200px theme(colors.blue), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
          '100%': {
            boxShadow: '0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent), 0 0px theme(colors.transparent)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
