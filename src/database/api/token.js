import { literal } from 'sequelize';
import { randomToken } from '../../crypto/util.js';
import { getUser } from '../../util/api.js';
import log from '../../util/logger.js';
import { getModel } from './util.js';

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'Token');
  const tokens = await model.findAll(
    {
      raw: true,
      where,
    },
  );
  const now = new Date();

  return tokens.map((token) => {
    const { timestamp, lifetime } = token;
    const ts = +new Date(timestamp); // + converts to ms
    const exp = new Date(ts + lifetime);
    return {
      ...token,
      isExpired: exp < now,
    };
  });
}

async function generate(ctx, options) {
  const Token = getModel(ctx, 'Token');
  const { sub, name, email } = getUser(ctx);
  const tokenString = await randomToken(32);
  const tokenData = {
    token: tokenString,
    timestamp: literal('CURRENT_TIMESTAMP'),
    sub,
    name,
    email,
    scopes: options.scopes,
    lifetime: options.lifetime,
    refresh: options.refresh,
  };
  await Token.create(tokenData);

  return tokenData;
}

async function refresh(ctx, sub) {
  const Token = getModel(ctx, 'Token');
  await Token.update({
    timestamp: literal('CURRENT_TIMESTAMP'),
  }, {
    where: { sub, refresh: true },
  });
}

async function cleanup(ctx) {
  const Token = getModel(ctx, 'Token');
  const tokens = await list(ctx);

  const expiredIds = tokens
    .filter((t) => !t.refresh && t.isExpired)
    .map((t) => t.id);
  const count = await Token.destroy({
    where: {
      id: expiredIds,
    },
  });
  if (count > 0) {
    log(`Removed ${count} expired tokens`);
  }
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
  generate,
  cleanup,
  list,
  refresh,
  destroy,
  find,
};
