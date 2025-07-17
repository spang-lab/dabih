import { createClient } from 'redis';
import logger from './logger';
const redisUrl = requireEnv('REDIS_URL');
const client = createClient({
    url: redisUrl,
});
import { init as initSecrets } from './redis/secrets';
import { requireEnv } from './env';
client.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
});
export async function initRedis() {
    await client.connect();
    await initSecrets();
}
export default client;
//# sourceMappingURL=redis.js.map