import jwt from 'jsonwebtoken';
import { log, requireEnv, setUser } from '../util/index.js';
import { resolveUser } from '../auth/index.js';

const parseHeader = (request) => {
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    throw new Error('No Authorization header');
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer.toLowerCase() === 'bearer' && token) {
    return token;
  }
  throw new Error('Invalid Authorization header, needs to be "Bearer <token>"');
};

const verifyToken = async (request) => {
  const token = parseHeader(request);
  const { origin } = request;

  const secret = requireEnv('TOKEN_SECRET');
  const decoded = jwt.verify(token, secret);

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
    const { request } = ctx;
    const { sub, scopes } = await verifyToken(request);
    ctx.data = {
      ...ctx.data,
      sub,
      scopes,
    };
  } catch (err) {
    ctx.error(`Auth failed: ${err.toString()}`, 401);
    return;
  }
  await next();
};

export default getMiddleware;
