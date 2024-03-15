'use client';

import { signOut } from 'next-auth/react';
import React from 'react';
import { LogOut, User as UserIcon } from 'react-feather';
import { useKey, useUser } from '@/lib/hooks';

export default function User() {
  const user = useUser();
  const key = useKey();
  if (user.status !== 'authenticated') {
    return null;
  }
  const {
    sub, name, email, scopes, isAdmin,
  } = user;

  return (
    <div className="border rounded-xl border-gray-400 p-2 flex flex-row items-center">
      <UserIcon className="text-blue mx-3" size={34} />
      <div>
        <span className="text-lg font-bold">
          {name}
        </span>
        <a className="text-blue px-2 font-bold" href={`mailto:${email}`}>
          {email}
        </a>
        <span className="text-gray-500 px-3">
          (id:
          {' '}
          {sub}
          )
        </span>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(key, null, 2)}</pre>
    </div>
  );

  return (
    <div className="w-full p-1 m-1 border border-gray-400 rounded-lg flex items-center">
      <UserIcon className="text-blue mx-3" size={34} />
      <div className="border-l pl-3 grow">
        <p className="font-mono">
          <span className="font-bold mr-3">ID:</span>
          {sub}
        </p>
        <p>
          <span className="font-bold mr-3">Name:</span>
          {name}
        </p>
        <p>
          <span className="font-bold mr-3">Email:</span>
          {email}
        </p>
        <p>
          <span className="font-bold mr-3">Scopes:</span>
          {scopes.join(', ')}
        </p>
        <p>
          <span className="font-bold mr-3">Role:</span>
          {(isAdmin) ? 'Admin' : 'User'}
        </p>
      </div>
      <div className="justify-self-end">
        <button
          type="button"
          className="flex flex-col bg-gray-600 text-sm items-center text-white px-2 py-1 rounded-md"
          onClick={() => signOut()}
        >
          <LogOut size={18} className="mb-1" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
