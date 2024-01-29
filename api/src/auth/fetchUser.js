import { getEnv } from '../util/config.js';
import providers from './providers/index.js';

const getAdmins = () => {
  const admins = getEnv('ADMINS', '');
  const adminList = admins.split(',')
    .map((sub) => sub.trim())
    .filter((sub) => !!sub);
  return adminList;
};

const splitToken = (accessToken) => {
  const [provider, ...rest] = accessToken.split('_');
  if (!rest || !rest.length) {
    throw new Error(
      'Invalid accessToken needs to be of the form <provider>_<token>',
    );
  }
  return {
    provider,
    token: rest.join('_'),
  };
};

export default async function fetchUser(ctx, accessToken) {
  const { provider, token } = splitToken(accessToken);
  const providerFunc = providers[provider];
  if (!providerFunc) {
    throw new Error(`Unknown Provider "${provider}" in accessToken`);
  }
  const user = await providerFunc(ctx, token);

  const admins = getAdmins();

  const { sub, email } = user;
  if (admins.includes(sub) || admins.includes(email)) {
    user.scopes.push('admin');
  }

  user.provider = provider;
  return user;
}
