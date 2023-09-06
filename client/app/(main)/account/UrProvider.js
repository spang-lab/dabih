'use client';

import { SignInError } from '@/components';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function URProvider({ provider }) {
  const [user, setUser] = useState({ uid: '', password: '' });

  const setUid = (uid) => setUser({ ...user, uid });
  const setPassword = (password) => setUser({ ...user, password });
  const logoSrc = '/images/providers/ur.png';

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(provider.id, user);
  };
  return (
    <div className="flex">
      <div className="border-b pb-4 mb-4 ">
        <SignInError />
        <form method="post" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="uid">
              <p className="font-extrabold m-1 text-xl">
                RZ Account
              </p>
              <input
                className="border w-full rounded-md px-2 py-1 my-1"
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
                className="border w-full rounded-md px-4 py-1 my-1"
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
