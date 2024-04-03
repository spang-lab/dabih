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

const server = async () => {
  await initDb();
  await initEphemeral();
  await initStorage();
  await initSchedule();

  const app = new Koa();
  const port = getEnv('PORT', 3001);
  const apiRoutes = apiRouter().routes();
  app.use(apiRoutes);

  app.listen(port);
  log(`API server listening on port ${port}`);
};

server();
