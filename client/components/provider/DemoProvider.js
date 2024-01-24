'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import Image from 'next/image';
import { Codesandbox } from 'react-feather';
import SignInError from './SignInError';

export default function URProvider({ provider }) {
  const [token, setToken] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(provider.id, { token });
  };
  return (
    <div className="flex">
      <div className="pb-4 mb-4 ">
        <SignInError />
        <form method="post" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="token">
              <p className="font-extrabold m-1 text-xl">
                Access Token
              </p>
              <input
                className="border w-full rounded-md px-4 py-1 my-1"
                name="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </label>
          </div>
          <button
            className="px-3 py-2 mt-4 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
            type="submit"
          >
            <Codesandbox size={32} className="pr-3" />
            Sign in with
            {' '}
            {provider.name}
          </button>
        </form>
      </div>
    </div>
  );
}
