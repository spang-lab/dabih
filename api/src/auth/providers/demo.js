import { getConfig } from '../../util/index.js';

export default async function dabihProvider(ctx, accessToken) {
  const { server } = getConfig();
  if (!server || !server.demo) {
    throw new Error('Demo Provider disabled');
  }
  if (accessToken !== server.demo) {
    throw new Error('Invalid access token.');
  }

  return {
    sub: 'root',
    name: 'Demo User',
    email: '',
    scopes: ['api', 'admin'],
  };
}
