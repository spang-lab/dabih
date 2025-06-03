import redis from '#lib/redis';

export async function storeChallenge(sub: string, challenge: string) {
  const fiveMinutes = 5 * 60;
  const ex = { EX: fiveMinutes };
  await redis.set(`challenge:${sub}`, challenge, ex);
}

export async function readChallenge(sub: string) {
  const challenge = await redis.get(`challenge:${sub}`);
  return challenge;
}

export async function deleteChallenge(sub: string) {
  await redis.del(`challenge:${sub}`);
}
