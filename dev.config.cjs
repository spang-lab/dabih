

const { getEnv, randomToken } = require('./helpers.cjs');

const demoToken = randomToken(12);
const emphemeralSecret = randomToken(32);
const nextauthSecret = randomToken(32);
const tokenSecret = randomToken(32);


const apps = [
  {
    cwd: './api',
    script: 'npm start',
    env: {
      PORT: getEnv('API_PORT', 3001),
      TOKEN_SECRET: getEnv('TOKEN_SECRET', tokenSecret),
      DB_URL: getEnv('DB_URL', 'sqlite:./data/dabih.sqlite'),
      DB_DEBUG: getEnv('DB_DEBUG', 'false'),
      DB_UPDATE: getEnv('DB_UPDATE', 'true'),
      STORAGE_URL: getEnv('STORAGE_URL', 'local:./data'),
      EPHEMERAL_URL: getEnv('EPHEMERAL_URL', 'memory'),
      EPHEMERAL_SECRET: getEnv('EPHEMERAL_SECRET', emphemeralSecret),
      CONFIG: getEnv('CONFIG', './config.yaml'),
    }
  },
  {
    cwd: './client',
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
