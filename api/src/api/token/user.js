import { token } from '../../database/index.js';
import { getUser } from '../../util/index.js';

const route = async (ctx) => {
  try {
    const user = await getUser(ctx);
    if (user.provider !== 'dabih') {
      await token.refresh(ctx, user.sub);
    }
    ctx.body = user;
  } catch (err) {
    // no user is expected
    ctx.body = null;
  }
};

export default route;
