import {
  log, parseUrl, requireEnv,
} from '../util/index.js';

import initRedis from './redis.js';
import initMemcached from './memcached.js';
import initMemory from './memory.js';

let client = null;

export const initEphemeral = async () => {
  const emphemeralUrl = requireEnv('EPHEMERAL_URL');
  if (emphemeralUrl === 'memory') {
    log('Memory adapter selected. You will need another adapter if you use multiple replicas.');
    client = await initMemory();
    return;
  }
  const { backend } = parseUrl(emphemeralUrl);
  if (backend === 'redis') {
    client = await initRedis();
    return;
  }
  if (backend === 'memcached') {
    client = await initMemcached();
    return;
  }
  throw new Error(`Invalid emphemeral adapter "${backend}", options are "memcached" or "memory"`);
};

export const getEphemeral = () => client;
