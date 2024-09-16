import Koa from 'koa';
import { koaBody } from 'koa-body';
import Router from '@koa/router';
import logger from '#lib/logger';
import { getEnv } from '#lib/env';
import { createReadStream } from 'fs';

import { RegisterRoutes } from '../build/routes';

import { error, log, serialize } from './middleware';
import { initFilesystem } from '#lib/fs';
import { initInodes } from '#lib/database/inodes';
import redis, { initRedis } from '#lib/redis';

const app = async (port?: number) => {
  await initFilesystem();
  await initInodes();
  await initRedis();
  const app = new Koa();
  app.use(koaBody());
  app.use(log());
  app.use(error());
  app.use(serialize());

  const apiRouter = new Router();
  RegisterRoutes(apiRouter);

  const appRouter = new Router();

  appRouter.get('/', (ctx) => {
    const docFile = './build/index.html';
    ctx.type = 'html';
    const stream = createReadStream(docFile);
    ctx.body = stream;
  });
  appRouter.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());

  app.use(appRouter.routes()).use(appRouter.allowedMethods());

  const lPort = port?.toString() ?? getEnv('PORT', '3001');

  const state = app.listen(lPort);
  logger.info(`API server listening on port ${lPort}`);
  state.on('close', () => {
    redis.quit().catch((err) => {
      logger.error(`Error closing redis: ${err}`);
    });
  });
  return state;
};

export default app;
