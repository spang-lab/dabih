'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import URProvider from './UrProvider';

export default function Provider({ provider }) {
  if (provider.id === 'ur') {
    return <URProvider provider={provider} />;
  }

  return (
    <div className="flex justify-center ">
      <button
        type="button"
        className="px-3 py-2 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
        onClick={() => signIn(provider.id)}
      >
        <Image
          width={32}
          height={32}
          className="mx-2"
          src={provider.style.logo}
          alt="Provider logo"
        />
        Sign in with
        {' '}
        {provider.name}
      </button>
    </div>

  );
}
