import { Context, Next } from 'koa';
import { Stream } from 'stream';

const convertBigInts = (_key: unknown, value: unknown) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

const serialize = async (ctx: Context, next: Next) => {
  await next();
  const { body } = ctx;
  if (
    !body ||
    body instanceof Stream ||
    body instanceof Blob ||
    body instanceof ReadableStream ||
    body instanceof Response ||
    Buffer.isBuffer(body)
  ) {
    return;
  }
  ctx.body = JSON.stringify(body, convertBigInts);
};
export default () => serialize;
