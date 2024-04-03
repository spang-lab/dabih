

const { getEnv, randomToken } = require('./helpers.cjs');

const demoToken = randomToken(12);
const emphemeralSecret = randomToken(32);
const nextauthSecret = randomToken(32);
const tokenSecret = randomToken(32);


const apps = [
  {
    name: 'api',
    cwd: './api',
    script: 'npm run build:start',
    watch: ['src'],
    restart_delay: 5000,
    env: {
      PORT: getEnv('API_PORT', 3001),
      TOKEN_SECRET: getEnv('TOKEN_SECRET', tokenSecret),
      STORAGE_URL: getEnv('STORAGE_URL', 'fs:./data'),
      EPHEMERAL_URL: getEnv('EPHEMERAL_URL', 'memory'),
      EPHEMERAL_SECRET: getEnv('EPHEMERAL_SECRET', emphemeralSecret),
    }
  },
  {
    name: 'next',
    cwd: './next',
    script: 'npm start',
    env: {
      PORT: getEnv('PORT', '3000'),
      API_URL: getEnv('API_URL', 'http://localhost:3001'),
      TOKEN_SECRET: getEnv('TOKEN_SECRET', tokenSecret),
      NEXTAUTH_URL: getEnv("NEXTAUTH_URL", "http://localhost:3000"),
      NEXTAUTH_SECRET: getEnv('NEXTAUTH_SECRET', nextauthSecret),
      NEXTAUTH_URL_INTERNAL: getEnv('NEXTAUTH_URL_INTERNAL', "http://localhost:3000"),
      DEMO: getEnv('DEMO', demoToken),
      ADMINS: getEnv('ADMINS', 'root'),
    }
  }
];

module.exports = { apps };
