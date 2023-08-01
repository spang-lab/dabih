import { signOut } from 'next-auth/react';
import React from 'react';
import { LogOut, User as UserIcon } from 'react-feather';
import { useUser } from '../hooks';

export default function User() {
  const user = useUser();
  if (!user) {
    return null;
  }
  const { sub, name, email } = user;

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
          {' '}
          {name}
        </p>
        <p>
          <span className="font-bold mr-3">Email:</span>
          {' '}
          {email}
        </p>
        <p>
          <span className="font-bold mr-3">Role:</span>
          {(user.isAdmin) ? 'Admin' : 'User'}
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
