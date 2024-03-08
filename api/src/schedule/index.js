import { scheduleJob } from 'node-schedule';
import { log } from '../util/index.js';

import cleanupUploads from './cleanupUploads.js';

const everyFiveMinutes = '*/5 * * * *';

const init = async () => {
  log('Starting schedules.');

  const job = async () => {
    await cleanupUploads();
  };
  job();
  scheduleJob(everyFiveMinutes, job);
};
export default init;
