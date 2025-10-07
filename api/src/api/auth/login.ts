import { getRedirectUrl } from '#lib/openid/index';
import { storeCodeVerifier } from '#lib/redis/codeVerifier';

export default async function login() {
  const { redirectUrl, codeVerifier, state } = await getRedirectUrl();
  await storeCodeVerifier(state, codeVerifier);
  return redirectUrl.href;
}
