import { sendError } from '../util/index.js';

const hasOverlap = (l1 = [], l2 = []) => l1.find((elem) => l2.includes(elem)) !== undefined;

export default (scopes) => {
  let required = scopes;
  if (!Array.isArray(scopes)) {
    required = [scopes];
  }
  return async (ctx, next) => {
    const { user } = ctx.state;
    if (!user) {
      sendError(ctx, 'No user');
      return;
    }
    if (!hasOverlap(required, user.scopes)) {
      sendError(ctx, `User has scopes [${user.scopes.join(', ')}], required is one of: [${required.join(', ')}]`, 401);
      return;
    }
    await next();
  };
};
