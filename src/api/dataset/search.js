import { dataset } from '../../database/index.js';
import { getSub } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { body } = ctx.request;

  const {
    query,
  } = body;

  const datasets = await dataset.search(ctx, sub, {
    query,
  });
  ctx.body = datasets;
};
export default route;
