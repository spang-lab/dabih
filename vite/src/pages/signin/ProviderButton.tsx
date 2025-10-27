import { OpenIDProvider } from "@/lib/api/types/auth";

export default function ProviderButton({ provider }: { provider: OpenIDProvider | null }) {
  if (!provider) {
    return null;
  }
  const { logo_uri, name } = provider;
  return (
    <a
      href="/api/v1/auth/login"
      className="border bg-blue text-white rounded-md px-4 py-2 my-1 inline-flex items-center justify-center"
    >
      <img src={logo_uri} alt={`${name} logo`} className="h-6 w-6 mr-2" />
      <span className="font-semibold">Sign in with {name}</span>
    </a>
  );
}
