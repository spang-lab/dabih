import { events } from '../../database/index.js';

const route = async (ctx) => {
  const eventDates = await events.listDates(ctx);
  ctx.body = eventDates;
};
export default route;
