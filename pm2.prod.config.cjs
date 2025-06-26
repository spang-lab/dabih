const { getEnv, randomToken } = require("./helpers.cjs");

const emphemeralSecret = randomToken(32);

const apps = [
  {
    name: "api",
    cwd: "/app/api",
    script: "/app/api/app.js",
    env: {
      NODE_ENV: "production",
      PORT: getEnv("PORT", "3001"),
      LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
      DB_URL: getEnv("DB_URL", ""),
      STORAGE_URL: getEnv("STORAGE_URL", "fs:./data"),
      REDIS_URL: getEnv("REDIS_URL", "redis://localhost:6379"),
      SECRET: getEnv("SECRET", emphemeralSecret),
    },
  },
];

module.exports = { apps };
