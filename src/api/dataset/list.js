import { dataset } from '../../database/index.js';
import { getSub } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);
  const datasets = await dataset.listAccessible(ctx, sub);
  ctx.body = datasets;
};
export default route;
