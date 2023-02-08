import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  ctx.body = await publicKey.listAllUsers(ctx);
};
export default route;
