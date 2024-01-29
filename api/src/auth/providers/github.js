export default async function githubProvider(_ctx, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const url = 'https://api.github.com/user';
  const response = await fetch(url, { headers });
  const user = await response.json();

  return {
    sub: user.login,
    name: user.name,
    email: user.email,
    scopes: ['api'],
  };
}
