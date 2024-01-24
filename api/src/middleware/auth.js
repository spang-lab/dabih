import { log, sendError, setUser } from '../util/index.js';
import { resolveUser } from '../auth/index.js';

const getMiddleware = () => async (ctx, next) => {
  try {
    const user = await resolveUser(ctx);
    setUser(ctx, user);
  } catch (err) {
    log.error(err.message);
    sendError(ctx, `Auth failed: ${err.toString()}`, 401);
    return;
  }
  await next();
};

export default getMiddleware;
