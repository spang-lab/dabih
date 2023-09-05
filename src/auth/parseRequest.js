export default async function parseRequest(ctx) {
  const { request } = ctx;
  const { query } = request;
  const authHeader = request.get('Authorization');

  if (query && query.token) {
    return `dabih_${query.token}`;
  }

  if (!authHeader) {
    throw new Error('No Authorization header');
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer.toLowerCase() === 'bearer' && token) {
    return token;
  }
  throw new Error('Invalid Authorization header, needs to be "Bearer <token>"');
}
