import { getConfig } from '../../util/index.js';

export default async function githubProvider(_ctx, accessToken) {
  const { admins } = getConfig();
  const { subs } = admins;
  const scopes = ['api'];
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const url = 'https://api.github.com/user';
  const response = await fetch(url, { headers });
  const user = await response.json();

  if (subs.includes(user.login)) {
    scopes.push('admin');
  }

  return {
    sub: user.login,
    name: user.name,
    email: user.email,
    scopes,
  };
}
