import { events } from '../../database/index.js';

const route = async (ctx) => {
  const { date } = ctx.params;
  if (!date) {
    ctx.error('No date', 400);
    return;
  }
  const eventList = await events.listDate(ctx, date);
  ctx.body = eventList;
};
export default route;
