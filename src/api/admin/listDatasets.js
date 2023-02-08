import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const datasets = await dataset.listAll(ctx);
  ctx.body = datasets;
};
export default route;
