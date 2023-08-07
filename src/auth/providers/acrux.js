import { getConfig } from '../../util/index.js';

const hasOverlap = (l1 = [], l2 = []) => l1.find((elem) => l2.includes(elem)) !== undefined;

export default async function acruxProvider(_ctx, accessToken) {
  const { admins } = getConfig();
  const { subs, groups } = admins;
  const url = 'https://auth.spang-lab.de/oidc/me';
  const scopes = ['api'];
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(url, { headers });
  const user = await response.json();
  if (!user || !user.sub || !user.name) {
    throw new Error('Failed to get user');
  }

  if (hasOverlap(groups, user.grouplist) || subs.includes(user.sub)) {
    scopes.push('admin');
  }

  return {
    sub: user.sub,
    name: user.name,
    scopes,
  };
}
