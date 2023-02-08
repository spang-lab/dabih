import LRU from 'lru-cache';
import { getConfig } from './config.js';
import { token } from '../database/index.js';
import log from './logger.js';

const oneMinute = 1000 * 60;

const cache = new LRU({
  max: 50,
  ttl: 30 * oneMinute,
});

const hasOverlap = (l1 = [], l2 = []) => l1.find((elem) => l2.includes(elem)) !== undefined;

const isExpired = (user) => {
  const { timestamp, lifetime } = user;
  const now = new Date();
  const ts = +new Date(timestamp); // + converts to ms
  const exp = new Date(ts + lifetime);
  return exp < now;
};

const fetchUserinfo = async (ctx, provider, accessToken) => {
  const { admins } = getConfig();
  const { subs, groups } = admins;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const scopes = ['api'];

  if (provider === 'dabih') {
    const user = await token.find(ctx, { token: accessToken });
    if (isExpired(user)) {
      throw new Error(`Token ${accessToken} is expired, sign in to the web app to refresh the token`);
    }
    return {
      sub: user.sub,
      name: user.name,
      scopes: user.scopes,
    };
  }

  if (provider === 'acrux') {
    const url = 'https://auth.spang-lab.de/oidc/me';
    const response = await fetch(url, { headers });
    const user = await response.json();

    if (hasOverlap(groups, user.grouplist) || subs.includes(user.sub)) {
      scopes.push('admin');
    }

    return {
      sub: user.sub,
      name: user.name,
      scopes,
    };
  }

  if (provider === 'github') {
    const url = 'https://api.github.com/user';
    const response = await fetch(url, { headers });
    const user = await response.json();

    if (subs.includes(user.login)) {
      scopes.push('admin');
    }

    return {
      sub: user.login,
      name: user.name,
      scopes,
    };
  }

  if (provider === 'google') {
    const url = 'https://openidconnect.googleapis.com/v1/userinfo';
    const response = await fetch(url, { headers });
    const user = await response.json();
    if (subs.includes(user.email)) {
      scopes.push('admin');
    }
    return {
      sub: user.sub,
      name: user.name,
      scopes,
    };
  }

  if (provider === 'azure-ad') {
    const manifestresp = await fetch('https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration');
    const manifest = await manifestresp.json();
    const response = await fetch(manifest.userinfo_endpoint, { headers });
    const user = await response.json();
    if (subs.includes(user.email)) {
      scopes.push('admin');
    }

    return {
      sub: user.sub,
      name: user.name,
      scopes,
    };
  }

  throw new Error(`Unsupported provider '${provider}' for accessToken`);
};

const getAccessToken = (ctx) => {
  const { request } = ctx;
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    log.warn('No Authorization header');
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  if (parts.length === 1) {
    log.warn('No type in Authorization header, needs to be "Bearer <token>". Interpreting whole header as a token');
    return authHeader;
  }
  log.warn('Invalid Authorization header, needs to be "Bearer <token>"');
  return null;
};

const getUserinfo = async (ctx) => {
  const accessToken = getAccessToken(ctx);

  const cached = cache.get(accessToken);
  if (cached) {
    return cached;
  }

  const [provider, ...rest] = accessToken.split('_');
  const user = await fetchUserinfo(ctx, provider, rest.join('_'));
  if (user) {
    cache.set(accessToken, user);
  }
  return user;
};

export default getUserinfo;
