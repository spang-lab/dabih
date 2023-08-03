export default function SpangLabProvider(options) {
  const { clientId, clientSecret } = options;
  if (!clientId || !clientSecret) {
    return null;
  }

  const provider = {
    clientId,
    clientSecret,
    id: 'acrux',
    name: 'Spang Lab Acrux',
    type: 'oauth',
    wellKnown:
      'https://auth.spang-lab.de/oidc/.well-known/openid-configuration',
    endSession: 'https://auth.spang-lab.de/oidc/session/end',
    authorization: {
      params: {
        scope: 'openid profile grouplist',
      },
    },
    idToken: true,
    checks: ['pkce', 'state'],
    style: {
      logo: '/images/spang-lab-logo-32.png',
      logoDark: 'images/spang-lab-logo-32.png',
      bg: '#fff',
      bgDark: '#000',
      text: '#000',
      textDark: '#fff',
    },
    options,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        image: '',
      };
    },
  };
  return provider;
}
