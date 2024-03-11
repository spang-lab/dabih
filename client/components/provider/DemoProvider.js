'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import Image from 'next/image';
import { Codesandbox } from 'react-feather';
import SignInError from './SignInError';

export default function URProvider({ provider }) {
  const [name, setName] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(provider.id, { name });
  };
  return (
    <div className="flex">
      <div className="pb-4 mb-4 ">
        <SignInError />
        <div className="text-red p-2">
          <p className="font-extrabold text-xl text-center pb-2">
            Warning
          </p>
          {' '}
          No authentication configured.
          This Demo Provider is for
          {' '}
          <span className="font-bold">testing only</span>
          ,
          {' '}
          it will accept any username without authentication.

        </div>
        <form method="post" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="name">
              <p className="font-extrabold m-1 text-xl">
                User Name
              </p>
              <input
                className="border w-full rounded-md px-4 py-1 my-1"
                name="name"
                maxLength={20}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
