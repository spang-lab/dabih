import log from './logger.js';

export const sendData = (ctx, data) => {
  ctx.body = { data };
};

export const sendError = (ctx, error, code = 500) => {
  log.error(error);
  ctx.status = code;
  ctx.body = error;
};

export const getUser = (ctx) => {
  if (!ctx.state) {
    throw new Error('Cannot get user. No ctx.state');
  }
  const { user } = ctx.state;
  if (!user || !user.sub) {
    throw new Error(`Cannot get user.
      getUser() must be called after auth middleware`);
  }
  return user;
};
export const getSub = (ctx) => getUser(ctx).sub;

export const setUser = (ctx, user) => {
  if (!ctx.state) {
    ctx.state = {};
  }
  ctx.state.user = user;
};
