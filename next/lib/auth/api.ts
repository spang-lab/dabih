
import { requireEnv } from '../config';
import createClient from '../api/api';
import { SignJWT } from 'jose';
import { Middleware } from 'openapi-fetch';
import { User } from 'next-auth';

export const signJWT = async (user: User) => {
  const { sub, scopes } = user;
  const host = requireEnv('API_URL');
  const tokenSecret = requireEnv("TOKEN_SECRET");

  const payload = {
    sub,
    scope: scopes.join(' '),
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('dabih')
    .setExpirationTime('1m')
    .setAudience(host)
    .sign(new TextEncoder().encode(tokenSecret));
};



const init = (user: User) => {
  const { sub, scopes } = user;
  const host = requireEnv('API_URL');
  const baseUrl = `${host}/api/v1/`;

  const tokenMiddleware: Middleware = {
    async onRequest(req) {
      if (!req.headers.has('Authorization')) {
        const token = await signJWT({ sub, scopes });
        req.headers.set('Authorization', `Bearer ${token}`);
      }
      return req;
    },
  };
  const api = createClient(baseUrl);
  api.client.use(tokenMiddleware);
  return api;
}

export default init;

