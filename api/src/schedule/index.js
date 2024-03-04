import { scheduleJob } from 'node-schedule';
import { log } from '../util/index.js';

import cleanupUploads from './cleanupUploads.js';
import integrityCheck from './integrityCheck.js';

const everyFiveMinutes = '*/5 * * * *';

const init = async () => {
  log('Starting schedules.');

  const job = async () => {
    await cleanupUploads();
    await integrityCheck();
  };
  job();
  scheduleJob(everyFiveMinutes, job);
};
export default init;
