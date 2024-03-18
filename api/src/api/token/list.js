import { token } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;
  const results = await token.list(ctx, {
    sub,
  });
  const censored = results.map((t) => {
    const n = t.value.length;
    const value = [...t.value].map((c, i) => {
      if (i < 14 || i > n - 4) {
        return c;
      }
      return '■';
    });
    return {
      ...t,
      value,
    };
  });

  ctx.body = censored;
};
export default route;
