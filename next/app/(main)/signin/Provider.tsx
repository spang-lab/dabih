import Image from 'next/image';
import URProvider from './UrProvider';
import DemoProvider from './DemoProvider';

import { signIn, Provider } from '@/lib/auth/auth';



export default function Provider({ provider }: { provider: Provider }) {
  const { id } = provider;
  if (id === 'demo') {
    return <DemoProvider provider={provider} />;
  }
  if (id === 'ur') {
    return <URProvider provider={provider} />;
  }

  const logoSrc = `/images/providers/${id}.png`;
  return (
    <div className="flex p-2">
      <form
        action={async () => {
          "use server";
          await signIn(provider.id)
        }}
      >
        <button
          type="button"
          className="px-3 py-2 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
        >
          <Image
            width={32}
            height={32}
            className="mx-2"
            src={logoSrc}
            alt="Provider logo"
          />
          Sign in with
          {' '}
          {provider.name}
        </button>
      </form>
    </div>

  );
}
