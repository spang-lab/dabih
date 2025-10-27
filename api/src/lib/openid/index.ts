import {
  discovery,
  Configuration,
  ServerMetadata,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  randomState,
  buildAuthorizationUrl,
  authorizationCodeGrant,
} from 'openid-client';
import { getEnv } from '../env';
import logger from '../logger';
import { OpenIDProvider } from 'src/api/types/auth';
import { initProvider, convertUserInfo } from './providers';
import { Request } from 'koa';
import { RequestError } from 'src/api/errors';

let provider: OpenIDProvider | null = null;
let config: Configuration | null = null;

export async function initOpenID() {
  const providerUrl = getEnv('OIDC_PROVIDER', null);
  if (!providerUrl) {
    logger.warn(
      'OIDC_PROVIDER is not set, skipping OpenID Connect initialization.',
    );
    return;
  }
  provider = initProvider(providerUrl);
  if (!provider) {
    logger.error(
      `OIDC provider ${providerUrl} not found. Skipping OIDC setup.`,
    );
    return;
  }
  const clientId = getEnv('OIDC_CLIENT_ID', null);
  const clientSecret = getEnv('OIDC_CLIENT_SECRET', null);
  if (!clientId) {
    throw new Error('OIDC_CLIENT_ID is required when OIDC_ISSUER is set.');
  }
  if (!clientSecret) {
    throw new Error('OIDC_CLIENT_SECRET is required when OIDC_ISSUER is set.');
  }
  logger.info(`Using OIDC provider: ${provider.name}`);
  if (provider.discovery) {
    logger.info(`Using discovery for issuer: ${providerUrl}`);
    try {
      const url = new URL(providerUrl);
      config = await discovery(url, clientId, clientSecret);
      logger.info('Discovered OIDC configuration');
    } catch (error) {
      logger.error(`Error discovering OIDC configuration: ${error as Error}`);
      config = null;
      provider = null;
    }
    return;
  }

  const serverData: ServerMetadata = {
    issuer: providerUrl,
    ...provider,
  };

  config = new Configuration(serverData, clientId, clientSecret);
}

export async function getRedirectUrl() {
  if (!config) {
    throw new Error('OpenID Connect is not configured.');
  }
  if (!config.serverMetadata().supportsPKCE() && !provider?.supportsPKCE) {
    throw new Error('OIDC provider does not support PKCE.');
  }

  const host = getEnv('HOST', null);
  if (!host) {
    throw new Error('HOST environment variable is required, but not set.');
  }
  const scope = getEnv('OIDC_SCOPE', 'openid email')!;

  const redirectUri = new URL('/api/v1/auth/callback', host).toString();
  logger.debug(`Using redirect URI: ${redirectUri}`);
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
  const state = randomState();

  const parameters = {
    redirect_uri: redirectUri,
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  };
  const redirectUrl = buildAuthorizationUrl(config, parameters);
  return {
    redirectUrl,
    codeVerifier,
    state,
  };
}

export async function authorizationCode(
  request: Request,
  expectedState: string,
  pkceCodeVerifier: string,
) {
  if (!config) {
    throw new Error('OpenID Connect is not configured.');
  }
  const host = getEnv('HOST', null);
  if (!host) {
    throw new Error('HOST environment variable is required, but not set.');
  }
  const callbackUrl = new URL(request.url, host);

  let tokens;
  try {
    tokens = await authorizationCodeGrant(config, callbackUrl, {
      pkceCodeVerifier,
      expectedState,
      idTokenExpected: false,
    });
  } catch (error) {
    console.log(error);
    logger.error(`Error during authorization code grant: ${error as Error}`);
    throw new RequestError('Invalid authorization code or state.');
  }

  if (!tokens.access_token) {
    throw new RequestError('No access token received from OIDC provider.');
  }
  return tokens.access_token;
}

export async function getUserInfo(accessToken: string) {
  if (!config || !provider) {
    throw new Error('OpenID Connect is not configured.');
  }
  const serverConfig = config.serverMetadata();
  if (!serverConfig.userinfo_endpoint) {
    throw new Error('OIDC provider does not support userinfo endpoint.');
  }
  const response = await fetch(serverConfig.userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch user info: ${response.status} ${response.statusText}`,
    );
  }
  const userInfo = (await response.json()) as Record<string, unknown>;
  return convertUserInfo(provider.id, userInfo);
}

export function getProvider(): OpenIDProvider | null {
  return provider;
}
