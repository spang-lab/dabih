import jwt from 'jsonwebtoken';
import { requireEnv } from '#env';
import { Request } from 'koa';

const parseHeader = (request: Request): string => {
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


interface DecodedToken {
  sub: string;
  scopes: string[];
  isAdmin: boolean;
}


const verifyToken = (request: Request): DecodedToken => {
  const tokenStr = parseHeader(request);
  const { origin } = request;

  const secret = requireEnv('TOKEN_SECRET');
  const decoded = jwt.verify(tokenStr, secret, {
    audience: origin,
  });
  if (typeof decoded === 'string') {
    throw new Error('Invalid jwt');
  }
  if (!decoded.sub) {
    throw new Error('No "sub" key in jwt');
  }
  if (!Array.isArray(decoded.scopes)) {
    throw new Error('No "scopes" key in jwt');
  }
  const { scopes, sub } = decoded;
  const isAdmin = scopes.includes('admin');
  return {
    sub,
    scopes,
    isAdmin,
  }
};


export function koaAuthentication(request: Request, name: string, scopes?: string[]) {
  if (name === 'jwt') {
    const decoded = verifyToken(request);
    const missing = scopes?.filter(scope => !decoded.scopes.includes(scope));
    if (missing?.length) {
      throw new Error(`JWT does not contain the required scope: ${missing.join(', ')}`);
    }
    return decoded;
  }
  throw new Error(`Unknown authentication method: ${name}`);
}


