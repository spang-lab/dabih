import redis from '#lib/redis';

const prefix = 'codeVerifier:';
const EX = 10 * 60; // 10 minutes

export async function storeCodeVerifier(state: string, codeVerifier: string) {
  const key = `${prefix}${state}`;
  await redis.set(key, codeVerifier, { EX });
}

export async function getCodeVerifier(state: string) {
  const key = `${prefix}${state}`;
  const codeVerifier = await redis.get(key);
  if (codeVerifier) {
    await redis.del(key); // Remove it after retrieval for one-time use
  }
  return codeVerifier;
}
