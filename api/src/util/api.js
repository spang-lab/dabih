import log from './logger.js';

const hasOverlap = (l1 = [], l2 = []) => l1.find((elem) => l2.includes(elem)) !== undefined;

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

export const userHasScope = (ctx, scopes) => {
  let required = [scopes];
  if (Array.isArray(scopes)) {
    required = scopes;
  }
  const user = getUser(ctx);
  return hasOverlap(required, user.scopes);
};

export const getSub = (ctx) => getUser(ctx).sub;

export const setUser = (ctx, user) => {
  if (!ctx.state) {
    ctx.state = {};
  }
  ctx.state.user = user;
};
