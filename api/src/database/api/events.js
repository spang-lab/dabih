import {
  fn, col,
} from 'sequelize';
import { getModel } from './util.js';

async function listDates(ctx) {
  const Event = getModel(ctx, 'Event');
  const results = await Event.findAll(
    {
      attributes: [[fn('DISTINCT', col('day')), 'day']],
      order: [['day', 'DESC']],
    },
  );
  return results.map((e) => e.day);
}

async function listDate(ctx, day) {
  const Event = getModel(ctx, 'Event');
  return Event.findAll({
    raw: true,
    where: {
      day,
    },
  });
}

async function add(ctx, ev) {
  const Event = getModel(ctx, 'Event');
  await Event.create(ev);
}

export default {
  listDates,
  listDate,
  add,
};
