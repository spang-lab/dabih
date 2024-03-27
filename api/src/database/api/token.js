import { random } from '../../crypto/index.js';
import log from '../../util/logger.js';
import { getModel } from './util.js';

const TOKEN_PREFIX = 'dabih_at_';

const getExpired = (exp) => {
  if (!exp) {
    return false;
  }
  const now = new Date();
  const date = new Date(exp);
  const diff = now.getTime() - date.getTime();
  if (diff < 0) {
    return false;
  }

  const oneMinute = 1000 * 60;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;

  if (diff < oneHour) {
    const minutes = Math.round(diff / oneMinute);
    return `${minutes} minute(s) ago`;
  }
  if (diff < oneDay) {
    const hours = Math.round(diff / oneHour);
    return `${hours} hour(s) ago`;
  }
  const days = Math.round(diff / oneDay);
  return `${days} day(s) ago`;
};

const convertToken = (token) => {
  const { exp, scope } = token;
  return {
    ...token,
    scopes: scope.split(' '),
    expired: getExpired(exp),
  };
};

async function list(ctx, where = {}) {
  const model = getModel(ctx, 'Token');
  const tokens = await model.findAll(
    {
      raw: true,
      where,
    },
  );
  return tokens.map(convertToken);
}

async function generate(ctx, rScopes, lifetimeSeconds) {
  const Token = getModel(ctx, 'Token');

  const { sub, scopes } = ctx.data;

  rScopes.forEach((scope) => {
    if (!scopes.includes(scope)) {
      throw new Error(`Scope ${scope} cannot be requested because you do not have it`);
    }
  });

  const token = await random.getToken(32);
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

async function findToken(ctx, value) {
  if (!value.startsWith(TOKEN_PREFIX)) {
    return null;
  }
  const Token = getModel(ctx, 'Token');
  const token = await Token.findOne({
    where: { value },
    raw: true,
  });
  return convertToken(token);
}

export default {
  generate,
  cleanup,
  list,
  destroy,
  findToken,
  find,
};
