const { randomFillSync } = require('node:crypto');

const uint8ToBase64Url = (array) => Buffer
  .from(array).toString('base64url');

const getEnv = (key, defaultValue = '') => {
  const { env } = process;
  const value = env[key];
  if (value) {
    return value;
  }
  console.log(`env.${key} not configured, using '${defaultValue}'`);
  return defaultValue;
};

const randomToken = (len = 8) => {
  const bitsPerChar = 6;
  const bitsPerByte = 8;
  const requiredBits = len * bitsPerChar;
  const requiredBytes = Math.ceil(requiredBits / bitsPerByte);
  const buffer = new Uint8Array(requiredBytes);
  randomFillSync(buffer);
  const base64 = uint8ToBase64Url(buffer);
  return base64;
};

module.exports = { getEnv, randomToken };
