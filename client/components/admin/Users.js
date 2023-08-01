import React from 'react';
import { User as UserIcon } from 'react-feather';
import { useUsers } from '../hooks';

function User({ data }) {
  const { sub, name } = data;

  return (
    <div className="max-w-sm p-1 m-1 border border-gray-400 rounded-lg">
      <UserIcon className="inline-block m-2 text-blue" size={24} />
      <span className="text-blue">
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
