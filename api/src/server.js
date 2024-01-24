/* eslint-disable no-await-in-loop */
import Koa from 'koa';

import {
  log,
  initConfig,
  getConfig,
} from './util/index.js';

import { initDb } from './database/index.js';
import { initEphemeral } from './ephemeral/index.js';
import { initStorage } from './storage/index.js';
import initSchedule from './schedule/index.js';
import apiRouter from './api/router.js';

export default async () => {
  await initConfig();
  await initDb();
  await initEphemeral();
  await initStorage();
  await initSchedule();

  const app = new Koa();
  const { server } = getConfig();
  const { port } = server;

  const apiRoutes = apiRouter().routes();
  app.use(apiRoutes);

  app.listen(port);
  log(`HTTP Server listening on port ${port}`);
};
