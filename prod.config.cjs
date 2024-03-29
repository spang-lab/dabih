
const { getEnv, randomToken } = require('./helpers.cjs');

const demoToken = randomToken(12);
const emphemeralSecret = randomToken(32);
const nextauthSecret = randomToken(32);


const apps = [
  {
    name: 'api',
    cwd: '/app/api',
    script: '/app/api/app.js',
    env: {
      NODE_ENV: 'production',
      DB_URL: getEnv('DB_URL', 'sqlite:./data/dabih.sqlite'),
      DB_DEBUG: getEnv('DB_DEBUG', 'false'),
      STORAGE_URL: getEnv('STORAGE_URL', 'local:./data'),
      EPHEMERAL_URL: getEnv('EPHEMERAL_URL', 'memory'),
      EPHEMERAL_SECRET: getEnv('EPHEMERAL_SECRET', emphemeralSecret),
      ADMINS: getEnv('ADMINS', 'root'),
      DEMO: getEnv('DEMO', demoToken),
      CONFIG: getEnv('CONFIG', '/etc/dabih/config.yaml'),
    }
  },
  {
    name: 'next',
    cwd: '/app/next',
    script: '/app/next/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: getEnv('PORT', '3000'),
      NEXTAUTH_URL: getEnv("NEXTAUTH_URL", "http://localhost:3000"),
      NEXTAUTH_SECRET: getEnv('NEXTAUTH_SECRET', nextauthSecret),
      NEXTAUTH_URL_INTERNAL: getEnv('NEXTAUTH_URL_INTERNAL', "http://host.docker.internal:3000"),
      DEMO: getEnv('DEMO', demoToken),
    }
  }
];

module.exports = { apps };
