import dbg from '#lib/dbg';
import { getRedirectUrl } from '#lib/openid/index';

export default async function login() {
  const { redirectUrl, codeVerifier, state } = await getRedirectUrl();

  dbg(codeVerifier, state);

  return redirectUrl.href;
}
