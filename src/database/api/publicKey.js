import { getModel, getTx } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'PublicKey');
  const tx = getTx(ctx);
  return model.findAllTx(
    tx,
    where,
  );
}

async function listAllUsers(ctx) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');

  const keys = await PublicKey.findAllTx(tx, {
    isRootKey: false,
  });

  const users = keys.map((key) => {
    const { name, sub, confirmed } = key;
    return { name, sub, confirmed: !!confirmed };
  });
  return users;
}

async function add(ctx, properties) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.createTx(tx, properties);
}
async function update(ctx, id, properties) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.updateTx(tx, properties, { id });
}
async function remove(ctx, id) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');
  await PublicKey.removeTx(tx, { id });
}
async function find(ctx, where) {
  const tx = getTx(ctx);
  const PublicKey = getModel(ctx, 'PublicKey');
  return PublicKey.findOneTx(tx, where);
}

export default {
  listAllUsers,
  list,
  add,
  update,
  remove,
  find,
};
