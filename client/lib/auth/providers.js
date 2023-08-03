import GitHubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';
import UniRegensburgProvider from './ur';
import SpangLabProvider from './spang-lab';

const isConfigured = (provider) => {
  if (!provider || !provider.options) {
    return false;
  }
  const { options } = provider;
  return Object.keys(options).every((key) => options[key]);
};

export default function getProviders() {
  const providers = [
    UniRegensburgProvider({
      enabled: process.env.UR_AUTH,
    }),
    SpangLabProvider({
      clientId: process.env.SPANGLAB_ID,
      clientSecret: process.env.SPANGLAB_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ];
  return providers.filter((p) => isConfigured(p));
}
