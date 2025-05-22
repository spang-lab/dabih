const { getEnv, randomToken } = require("./helpers.cjs");

const demoToken = randomToken(12);
const emphemeralSecret = randomToken(32);
const authSecret = randomToken(32);
const tokenSecret = randomToken(32);

const apps = [
  {
    name: "api",
    cwd: "/app/api",
    script: "/app/api/app.js",
    env: {
      NODE_ENV: "production",
      TOKEN_SECRET: tokenSecret,
      PORT: getEnv("PORT", "3001"),
      LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
      DB_URL: getEnv("DB_URL", ""),
      STORAGE_URL: getEnv("STORAGE_URL", "fs:./data"),
      REDIS_URL: getEnv("REDIS_URL", "redis://localhost:6379"),
      EPHEMERAL_SECRET: getEnv("EPHEMERAL_SECRET", emphemeralSecret),
    },
  },
  {
    name: "next",
    cwd: "/app/next",
    script: "/app/next/server.js",
    env: {
      NODE_ENV: "production",
      API_URL: getEnv("API_URL", "http://localhost:3001"),
      BASE_URL: getEnv("BASE_URL", "http://localhost:3000"),
      TOKEN_SECRET: tokenSecret,
      AUTH_SECRET: authSecret,
    },
  },
];

module.exports = { apps };
