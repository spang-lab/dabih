module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './markdown/**/*.md',
    './node_modules/@containers/components/dist/*.js',
  ],
  theme: {
    colors: {
      gray: {
        light: '#f1f5f9',
        mid: '#64748b',
        dark: '#1e293b',
      },
      danger: '#be123c',
      success: '#047857',
      main: {
        light: '#649ef6',
        mid: '#4839d3',
        dark: '#312087',
      },
    },
    extend: {},
  },
  plugins: [],
};
