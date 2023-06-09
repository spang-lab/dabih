module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './markdown/**/*.md',
    './node_modules/@containers/components/dist/*.js',
  ],
  theme: {
    colors: {
      muted: '#94a3b8',
      danger: '#be123c',
      success: '#047857',
      main: {
        50: '#d6f2ff',
        100: '#c1eafe',
        200: '#abe1fe',
        300: '#97d6fc',
        400: '#84c9fb',
        500: '#649ef6',
        600: '#4d59ec',
        700: '#4839d3',
        800: '#312087',
        900: '#130b33',
      },
    },
    extend: {},
  },
  plugins: [],
};
