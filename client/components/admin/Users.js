import React from 'react';
import { User as UserIcon } from 'react-feather';
import { useUsers } from '../util';

function User({ data }) {
  const { sub, name } = data;

  return (
    <div className="max-w-sm p-1 m-1 border border-gray-300 rounded-lg">
      <UserIcon className="inline-block m-2 text-sky-700" size={24} />
      <span className="text-sky-700">
        {' '}
        {sub}
        {' '}
      </span>
      {name}
    </div>
  );
}

export default function PublicKeys() {
  const users = useUsers();
  if (!users) {
    return null;
  }
  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Users
      </h3>
      {users.map((u) => (
        <User key={u.sub} data={u} />
      ))}
    </div>
  );
}
