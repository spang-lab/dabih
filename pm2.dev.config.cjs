const apps = [
  {
    name: 'api',
    cwd: './api',
    script: 'npm run dev',
    watch: ['src'],
    autorestart: false,
  },
  {
    name: 'next',
    cwd: './next',
    script: 'npm run dev',
    autorestart: false,
  }
];

module.exports = { apps };