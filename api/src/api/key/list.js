import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const keys = await publicKey.list(ctx);
  ctx.body = keys.map((k) => ({
    ...k,
    data: null,
  }));
};
export default route;
