import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import Router from '@koa/router';
import logger from '#lib/logger';
import { getEnv } from '#lib/env';
import serve from 'koa-static';

import { RegisterRoutes } from '../build/routes';

import { error, indexFallback, log, serialize } from './middleware';
import { init as initFilesystem } from '#lib/fs';
import { initInodes } from '#lib/database/inodes';
import redis, { initRedis } from '#lib/redis';
import { initEmail } from '#lib/email';

const app = async (port?: number) => {
  await initFilesystem();
  await initInodes();
  await initRedis();
  initEmail();
  const app = new Koa();
  app.use(bodyParser());
  app.use(log());
  app.use(error());
  app.use(serialize());

  if (getEnv('NODE_ENV', 'development') === 'development') {
    logger.warn('Server is running in development mode');
  }
  const log_level = getEnv('LOG_LEVEL', 'info');
  logger.info(`Log level is ${log_level}`);

  const apiRouter = new Router();
  RegisterRoutes(apiRouter);

  const appRouter = new Router();
  appRouter.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());

  app.use(serve('dist', {}));
  app.use(appRouter.routes()).use(appRouter.allowedMethods());

  app.use(indexFallback());

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
