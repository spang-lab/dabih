import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const datasets = await dataset.listOrphans(ctx);
  ctx.body = datasets;
};
export default route;
