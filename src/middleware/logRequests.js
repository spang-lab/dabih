import { log } from '../util/index.js';

const timeToString = (timeMs) => {
  if (timeMs < 1000) {
    return `${timeMs}ms`;
  }
  return `${Math.round(timeMs / 1000)}s`;
};

export default async (ctx, next) => {
  const start = Date.now();
  const { url, method } = ctx.request;
  log(`-> Req ${url} ${method}`);
  await next();
  const timeMs = Date.now() - start;

  const time = timeToString(timeMs);
  const { status } = ctx.response;

  log(`<- Res ${url} ${status} ${time}`);
};
