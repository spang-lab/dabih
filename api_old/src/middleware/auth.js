import jwt from 'jsonwebtoken';
import { requireEnv } from '../util/index.js';
import { token } from '../database/index.js';

const parseHeader = (request) => {
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    throw new Error('No Authorization header');
  }
  const [bearer, value] = authHeader.split(' ');
  if (bearer.toLowerCase() === 'bearer' && value) {
    return value;
  }
  throw new Error('Invalid Authorization header, needs to be "Bearer <token>"');
};

const verifyToken = async (ctx) => {
  const { request } = ctx;
  const tokenStr = parseHeader(request);

  const dbToken = await token.findToken(ctx, tokenStr);
  if (dbToken) {
    if (dbToken.expired) {
      throw new Error(`Token has expired ${dbToken.expired}`);
    }
    return dbToken;
  }

  const { origin } = request;
  const secret = requireEnv('TOKEN_SECRET');
  const decoded = jwt.verify(tokenStr, secret);
  const { aud } = decoded;
  if (aud !== origin) {
    throw new Error(`Invalid jwt audience ${aud}, needs to be ${origin}`);
  }
  if (!decoded.sub) {
    throw new Error('No "sub" key in jwt');
  }

  return decoded;
};

const getMiddleware = () => async (ctx, next) => {
  try {
    const { sub, scopes } = await verifyToken(ctx);
    const isAdmin = scopes.includes('admin');
    ctx.data = {
      ...ctx.data,
      sub,
      scopes,
      isAdmin,
    };
  } catch (err) {
    ctx.error(`Auth failed: ${err.toString()}`, 401);
    return;
  }
  await next();
};

export default getMiddleware;
