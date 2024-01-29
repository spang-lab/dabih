export default async function azureAdProvider(_ctx, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const manifestresp = await fetch(
    'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
  );
  const manifest = await manifestresp.json();
  const response = await fetch(manifest.userinfo_endpoint, { headers });
  const user = await response.json();

  return {
    sub: user.sub,
    name: user.name,
    email: user.email,
    scopes: ['api'],
  };
}
