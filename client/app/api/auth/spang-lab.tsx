import { Provider } from 'next-auth/providers';
import { User } from 'next-auth';

export default function SpangLabProvider(options:
{clientId: string, clientSecret: string}): Provider {
  const { clientId, clientSecret } = options;

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
    profile(profile: {sub: String, name: String}): User {
      return {
        id: profile.sub,
        name: profile.name,
        image: '',
      } as User;
    },
  };
  return provider as Provider;
}
