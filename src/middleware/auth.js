import {
  log, sendError, setUser, getUserinfo,
} from '../util/index.js';

const getMiddleware = () => async (ctx, next) => {
  try {
    const user = await getUserinfo(ctx);
    setUser(ctx, user);
  } catch (err) {
    log.error(err);
    sendError(ctx, `Auth failed: ${err.toString()}`, 401);
    return;
  }
  await next();
};

export default getMiddleware;
