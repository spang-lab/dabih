import { LRUCache } from 'lru-cache';
import parseRequest from './parseRequest.js';
import fetchUser from './fetchUser.js';

const tenMinutes = 10 * 1000 * 60;
const cache = new LRUCache({
  max: 50,
  ttl: tenMinutes,
});

export default async function resolveUser(ctx) {
  const accessToken = await parseRequest(ctx);

  const cachedUser = cache.get(accessToken);
  if (cachedUser) {
    return cachedUser;
  }
  const user = await fetchUser(ctx, accessToken);
  cache.set(accessToken, user);
  return user;
}
