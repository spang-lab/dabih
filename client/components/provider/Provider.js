'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import URProvider from './UrProvider';

export default function Provider({ provider }) {
  const { id } = provider;
  if (id === 'ur') {
    return <URProvider provider={provider} />;
  }
  const logoSrc = `/images/providers/${id}.png`;

  return (
    <div className="flex p-2">
      <button
        type="button"
        className="px-3 py-2 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
        onClick={() => signIn(provider.id)}
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
    </div>

  );
}
