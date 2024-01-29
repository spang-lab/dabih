export default async function acruxProvider(_ctx, accessToken) {
  const url = 'https://auth.spang-lab.de/oidc/me';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(url, { headers });
  const user = await response.json();
  if (!user || !user.sub || !user.name) {
    throw new Error('Failed to get user');
  }

  return {
    sub: user.sub,
    name: user.name,
    email: user.email,
    scopes: ['api'],
  };
}
