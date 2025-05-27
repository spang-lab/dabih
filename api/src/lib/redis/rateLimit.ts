import redis from '#lib/redis';
import logger from '#lib/logger';

const prefix = 'rateLimit:';
const windowSeconds = 60;
const maxRequests = 3;

export async function rateLimit(ip: string): Promise<void> {
  const key = `${prefix}:${ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  if (current > maxRequests) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    throw new Error('Rate limit exceeded. Please try again later.');
  }
}
