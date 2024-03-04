import { log, sendError } from '../util/index.js';

const getMainStackMessage = (error) => {
  const { stack } = error;
  if (!stack) {
    return '';
  }
  const messages = stack.split('\n');
  if (messages.length < 2) {
    return '';
  }

  const pwd = process.cwd();
  const shortMessage = messages
    .map((m) => m.replaceAll(pwd, '').trim())
    .join('    ');
  return shortMessage;
};

export default async (ctx, next) => {
  try {
    ctx.error = (message, code = 500) => {
      log.error(message);
      ctx.status = code;
      ctx.body = message;
    };
    await next();
  } catch (err) {
    const stack = getMainStackMessage(err);
    const message = `${err.message} ${stack}`;
    ctx.error(message, 500);
  }
};
