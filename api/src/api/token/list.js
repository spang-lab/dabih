import { getSub } from '../../util/index.js';
import { token } from '../../database/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);
  const results = await token.list(ctx, {
    sub,
  });
  const censored = results.map((t) => {
    const n = t.token.length;
    const start = t.token.substring(0, 5);
    const end = t.token.substring(n - 5);
    const mid = '...';
    return {
      ...t,
      token: `${start}${mid}${end}`,
    };
  });

  ctx.body = censored;
};
export default route;
