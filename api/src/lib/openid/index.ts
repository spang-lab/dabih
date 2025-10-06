import {
  discovery,
  Configuration,
  ServerMetadata,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  randomState,
  buildAuthorizationUrl,
} from 'openid-client';
import { getEnv } from '../env';
import logger from '../logger';
import { OpenIDProvider } from 'src/api/types/auth';
import providers from './providers';

let provider: OpenIDProvider | null = null;
let config: Configuration | null = null;

export async function initOpenID() {
  const providerId = getEnv('OIDC_PROVIDER', null);
  if (!providerId) {
    logger.warn(
      'OIDC_PROVIDER is not set, skipping OpenID Connect initialization.',
    );
    return;
  }
  provider = providers.find((p) => p.id === providerId) ?? null;
  if (!provider) {
    logger.error(`OIDC provider ${providerId} not found. Skipping OIDC setup.`);
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
  if (provider.discovery && provider.issuer) {
    logger.info(`Using discovery for issuer: ${provider.issuer}`);
    try {
      const url = new URL(provider.issuer);
      config = await discovery(url, clientId, clientSecret);
      logger.info(`Discovered OIDC configuration: ${JSON.stringify(config)}`);
    } catch (error) {
      logger.error(`Error discovering OIDC configuration: ${error as Error}`);
      config = null;
      provider = null;
    }
    return;
  }
  config = new Configuration(
    provider as ServerMetadata,
    clientId,
    clientSecret,
  );
}

export async function getRedirectUrl() {
  if (!config) {
    throw new Error('OpenID Connect is not configured.');
  }
  if (!config.serverMetadata().supportsPKCE()) {
    throw new Error('OIDC provider does not support PKCE.');
  }

  const host = getEnv('HOST', null);
  if (!host) {
    throw new Error('HOST environment variable is required, but not set.');
  }
  const redirectUri = new URL('/api/v1/auth/callback', host).toString();
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
  const state = randomState();

  const parameters = {
    redirect_uri: redirectUri,
    scope: 'openid email',
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

export async function authorizationCodeGrant() {
  throw new Error('Not implemented');
}

export function getProvider(): OpenIDProvider | null {
  return provider;
}
