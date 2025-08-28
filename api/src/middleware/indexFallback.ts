import { Context, Next } from 'koa';

import { createReadStream } from 'node:fs';

const fallback = async (ctx: Context, next: Next) => {
  await next();
  if (ctx.status === 404) {
    ctx.type = 'html';
    ctx.body = createReadStream('dist/index.html');
  }
};

export default () => fallback;
