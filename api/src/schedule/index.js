import { scheduleJob } from 'node-schedule';
import { log } from '../util/index.js';

import cleanupUploads from './cleanupUploads.js';
import integrityCheck from './integrityCheck.js';
import checkRootKeys from './checkRootKeys.js';
import cleanupTokens from './cleanupTokens.js';

const everyFiveMinutes = '*/5 * * * *';

const init = async () => {
  log('Starting schedules.');

  const job = async () => {
    await checkRootKeys();
    await cleanupUploads();
    await integrityCheck();
    await cleanupTokens();
  };
  job();
  scheduleJob(everyFiveMinutes, job);
};
export default init;
