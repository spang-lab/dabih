import { getModel } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'PublicKey');
  return model.findAll({
    raw: true,
    where,
  });
}

async function listAllUsers(ctx) {
  const PublicKey = getModel(ctx, 'PublicKey');

  const keys = await PublicKey.findAll({
    where: {
      isRootKey: false,
    },
  });

  const users = keys.map((key) => {
    const {
      name, sub, email, confirmed,
    } = key;
    return {
      name, sub, email, confirmed: !!confirmed,
    };
  });
  return users;
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
  listAllUsers,
  list,
  add,
  update,
  remove,
  find,
};
