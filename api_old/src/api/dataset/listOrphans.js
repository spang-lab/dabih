import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { isAdmin } = ctx.data;
  if (!isAdmin) {
    ctx.error('Only Admins can list orphaned datasets', 401);
    return;
  }

  const datasets = await dataset.listOrphans(ctx);
  ctx.body = datasets;
};
export default route;
