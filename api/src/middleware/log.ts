import logger from '#lib/logger';
import { Context, Next } from 'koa';

const timeToString = (timeMs: number) => {
  if (timeMs < 1000) {
    return `${timeMs}ms`;
  }
  return `${Math.round(timeMs / 1000)}s`;
};

const log = async (ctx: Context, next: Next) => {
  const start = Date.now();
  const { url, method } = ctx.request;
  await next();
  const timeMs = Date.now() - start;

  const time = timeToString(timeMs);
  const { status } = ctx.response;

  logger.http(`${method} ${url} ${status} ${time}`);
};
export default () => log;
