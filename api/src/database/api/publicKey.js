import { getModel } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'PublicKey');
  return model.findAll({
    raw: true,
    where,
  });
}

async function add(ctx, properties) {
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.create(properties);
}
async function update(ctx, id, properties) {
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.update(properties, { where: { id } });
}
async function remove(ctx, id) {
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.destroy({ where: { id } });
}
async function find(ctx, where) {
  const PublicKey = getModel(ctx, 'PublicKey');
  return PublicKey.findOne({ where });
}

export default {
  list,
  add,
  update,
  remove,
  find,
};
