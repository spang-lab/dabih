import dbg from '#lib/dbg';
import { authorizationCode } from '#lib/openid/index';
import { getCodeVerifier } from '#lib/redis/codeVerifier';
import { Request } from 'koa';
import { RequestError } from '../errors';

export default async function callback(
  request: Request,
  state: string,
  code: string,
) {
  const codeVerifier = await getCodeVerifier(state);
  if (!codeVerifier) {
    throw new RequestError('Could not find code verifier in redis');
  }

  const tokens = await authorizationCode(request, state, codeVerifier, code);
  dbg('Tokens: ', tokens);

  throw new Error('Not implemented');
}
