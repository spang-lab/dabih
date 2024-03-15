'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function ErrorMessage() {
  const { data: session } = useSession();
  const params = useSearchParams();
  let error = null;
  if (session && session.error) {
    error = session.error;
  } else {
    error = params.get('error');
  }

  if (!error) {
    return null;
  }

  return (
    <div className="p-3 m-3 text-base text-center text-red bg-red/20 rounded-lg">
      <p className="font-extrabold">
        Error during sign in.
      </p>
      <span className="text-sm">
        Please check your credentials.
      </span>
      <p className="text-xs text-gray-500">
        {error}
      </p>

    </div>
  );
}
