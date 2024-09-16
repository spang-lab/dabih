import { createClient } from 'redis';
import logger from './logger';

const client = createClient();
import { init } from './redis/aesKey';

client.on('error', (err) => {
  logger.error(`Redis error: ${err}`);
});

export async function initRedis() {
  await client.connect();
  await init();
}

export default client;
