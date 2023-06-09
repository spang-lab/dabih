module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './markdown/**/*.md',
    './node_modules/@containers/components/dist/*.js',
  ],
  theme: {
    colors: {
      white: '#ffffff',
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
      danger: '#be123c',
      success: '#047857',
      active: '#5eead4',

      main: {
        100: '#052133',
        200: '#145D76',
        300: '#22818E',
        400: '#34AAA8',
        500: '#5BFDE6',
      },
    },
    extend: {},
  },
  plugins: [],
};
