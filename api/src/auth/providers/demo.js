import { requireEnv } from '../../util/index.js';

export default async function demoProvider(_ctx, accessToken) {
  const token = requireEnv('DEMO');
  if (accessToken !== token) {
    throw new Error('Invalid access token.');
  }

  return {
    sub: 'root',
    name: 'Demo User',
    email: 'anonymous@example.com',
    scopes: ['api'],
  };
}
