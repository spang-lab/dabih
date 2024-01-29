/* eslint-disable no-await-in-loop */
import Koa from 'koa';

import {
  log,
  getEnv,
} from './util/index.js';

import { initDb } from './database/index.js';
import { initEphemeral } from './ephemeral/index.js';
import { initStorage } from './storage/index.js';
import initSchedule from './schedule/index.js';
import apiRouter from './api/router.js';

export default async () => {
  await initDb();
  await initEphemeral();
  await initStorage();
  await initSchedule();

  const app = new Koa();

  const demo = getEnv('DEMO', false);
  const port = getEnv('API_PORT', 3001);

  if (demo) {
    log.warn('+----------- DEMO MODE ------------+');
    log.warn('Remove the key "server.demo" in the config to disable.');
    log.raw('');
    log.warn('DO NOT USE THIS FOR PRODUCTION');
    log.raw('');
    log.warn('This mode is ONLY for evaluation purposes.');
    log.raw('');
    log.warn('All functions can be accessed with the access token:');
    log.raw('');
    log.blue(` ${demo}`);
    log.raw('');
    log.warn('+----------- DEMO MODE ------------+');
  }

  const apiRoutes = apiRouter().routes();
  app.use(apiRoutes);

  app.listen(port);
  log(`API server listening on port ${port}`);
};
