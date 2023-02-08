import { getConfig, log } from '../util/index.js';

import initMemcached from './memcached.js';
import initMemory from './memory.js';

let client = null;

export const initEphemeral = async () => {
  const { ephemeral } = getConfig();
  const { adapter } = ephemeral;
  if (adapter === 'memcached') {
    client = await initMemcached();
    return;
  }
  if (adapter === 'memory') {
    log.warn('Ephemeral memory adapter selected!');
    log.warn('You will need the memcached adapter if you use multiple replicas');
    client = await initMemory();
    return;
  }
  throw new Error(`Invalid emphemeral adapter "${adapter}", options are "memcached" or "memory"`);
};

export const getEphemeral = () => client;
