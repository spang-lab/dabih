import Koa from 'koa';
import { koaBody } from 'koa-body';
import Router from '@koa/router';
import logger from '#logger';
import { getEnv } from '#env';
import { createReadStream } from 'fs';

import { RegisterRoutes } from '../build/routes';

import { error } from './middleware';

const server = async () => {
  const app = new Koa();
  app.use(koaBody());
  app.use(error());

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

  app
    .use(appRouter.routes())
    .use(appRouter.allowedMethods());


  const port = getEnv('PORT', '3001');
  app.listen(port);
  logger.info(`API server listening on port ${port}`);
}

void server();

