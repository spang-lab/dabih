import { randomToken } from '../../crypto/util.js';
import log from '../../util/logger.js';
import { getModel } from './util.js';

const TOKEN_PREFIX = 'dabih_at_';

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
    const { exp } = token;
    if (!exp) {
      return {
        ...token,
        isExpired: false,
      };
    }
    return {
      ...token,
      isExpired: now > exp,
    };
  });
}

async function generate(ctx, rScopes, lifetimeSeconds) {
  const Token = getModel(ctx, 'Token');

  const { sub, scopes } = ctx.data;

  rScopes.forEach((scope) => {
    if (!scopes.includes(scope)) {
      throw new Error(`Scope ${scope} cannot be requested because you do not have it`);
    }
  });

  const token = await randomToken(32);
  const value = `${TOKEN_PREFIX}${token}`;

  let exp = null;
  if (lifetimeSeconds) {
    const nowMs = +new Date();
    const expMs = nowMs + lifetimeSeconds * 1000;
    exp = new Date(expMs);
  }

  const tokenData = {
    value,
    sub,
    scope: rScopes,
    exp,
  };
  await Token.create(tokenData);
  return tokenData;
}

async function cleanup(ctx) {
  const Token = getModel(ctx, 'Token');
  const tokens = await list(ctx);

  const expiredIds = tokens
    .filter((t) => t.isExpired)
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
  destroy,
  find,
};
