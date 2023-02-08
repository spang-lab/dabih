import { literal } from 'sequelize';
import { getModel, getTx } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'Token');
  const tx = getTx(ctx);
  return model.findAllTx(
    tx,
    where,
  );
}

async function add(ctx, properties) {
  const tx = getTx(ctx);
  const Token = getModel(ctx, 'Token');
  await Token.createTx(tx, properties);
}
async function refresh(ctx, sub) {
  const tx = getTx(ctx);
  const Token = getModel(ctx, 'Token');
  await Token.updateTx(tx, { timestamp: literal('CURRENT_TIMESTAMP') }, { sub });
}
async function destroy(ctx, where) {
  const tx = getTx(ctx);
  const Token = getModel(ctx, 'Token');
  await Token.destroyTx(tx, where);
}
async function find(ctx, where) {
  const tx = getTx(ctx);
  const Token = getModel(ctx, 'Token');
  return Token.findOneTx(tx, where);
}

export default {
  list,
  add,
  refresh,
  destroy,
  find,
};
