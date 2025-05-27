'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import SignInError from './SignInError';

export default function URProvider({ provider }) {
  const [user, setUser] = useState({ uid: '', password: '' });

  const setUid = (uid: string) => setUser({ ...user, uid });
  const setPassword = (password: string) => setUser({ ...user, password });
  const logoSrc = '/images/providers/ur.png';

  const onSubmit = (e: any) => {
    e.preventDefault();
    signIn(provider.id, user);
  };
  return (
    <div className="flex">
      <div className="border-b pb-4 mb-4  border-gray-200">
        <SignInError />
        <form method="post" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="uid">
              <p className="font-extrabold m-1 text-xl">
                RZ Account
              </p>
              <input
                className="border w-full rounded-md px-2 py-1 my-1 border-gray-200"
                name="uid"
                id="uid"
                type="text"
                placeholder="abc12345"
                value={user.uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </label>
          </div>
          <div className="w-full">
            <label htmlFor="password">
              <p className="font-extrabold m-1 text-xl">
                Password
              </p>
              <input
                className="border w-full rounded-md px-4 py-1 my-1 border-gray-200"
                name="password"
                type="password"
                value={user.password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button
            className="px-3 py-2 mt-4 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
            type="submit"
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
    </div>
  );
}
