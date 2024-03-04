import { getUser, userHasScope } from '../util/index.js';

export default (scopes) => async (ctx, next) => {
  if (!userHasScope(ctx, scopes)) {
    const user = getUser(ctx);
    ctx.error(`User has scopes [${user.scopes.join(', ')}], required is one of: ${JSON.stringify(scopes)}`, 401);
    return;
  }
  await next();
};
