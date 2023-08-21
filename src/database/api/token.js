import { literal } from 'sequelize';
import { getModel } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'Token');
  return model.findAll(
    {
      raw: true,
      where,
    },
  );
}

async function add(ctx, properties) {
  const Token = getModel(ctx, 'Token');
  await Token.create(properties);
}
async function refresh(ctx, sub) {
  const Token = getModel(ctx, 'Token');
  await Token.update({ timestamp: literal('CURRENT_TIMESTAMP') }, { where: { sub } });
}
async function destroy(ctx, where) {
  const Token = getModel(ctx, 'Token');
  await Token.destroy({ where });
}
async function find(ctx, where) {
  const Token = getModel(ctx, 'Token');
  return Token.findOne({ where });
}

export default {
  list,
  add,
  refresh,
  destroy,
  find,
};
