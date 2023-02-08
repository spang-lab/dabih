import { getModel, getTx } from './util.js';

async function listDates(ctx) {
  const tx = getTx(ctx);
  const Event = getModel(ctx, 'Event');
  const results = await Event.listDates(tx);
  return results.map((e) => e.day);
}

async function listDate(ctx, day) {
  const tx = getTx(ctx);
  const Event = getModel(ctx, 'Event');
  return Event.findAllTx(tx, {
    day,
  });
}

async function add(ctx, ev) {
  const tx = getTx(ctx);
  const Event = getModel(ctx, 'Event');
  await Event.createTx(tx, ev);
}

export default {
  listDates,
  listDate,
  add,
};
