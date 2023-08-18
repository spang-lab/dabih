import providers from './providers/index.js';

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
  user.provider = provider;
  return user;
}
