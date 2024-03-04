export const parseToken = (request) => {
  // Parse request query
  const { query } = request;
  if (query && query.token) {
    return query.token;
  }
  // Parse Authorization Header
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    throw new Error('No Authorization header');
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer.toLowerCase() === 'bearer' && token) {
    return token;
  }
  throw new Error('Invalid Authorization header, needs to be "Bearer <token>"');
};

export const scopes = {
  KEY: 'key',
  UPLOAD: 'upload',
  DATASET: 'dataset',
  DOWNLOAD: 'download',
  ADMIN: 'admin',
};
