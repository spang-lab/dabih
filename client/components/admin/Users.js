import React from 'react';
import { User as UserIcon } from 'react-feather';
import {
  Color, Title3, useUsers,
} from '../util';

function User({ data }) {
  const {
    sub, name,
  } = data;

  return (
    <div className="max-w-sm p-1 m-1 border border-gray-300 rounded-lg">
      <UserIcon className="inline-block m-2 text-sky-700" size={24} />
      <Color>
        {sub}
      </Color>
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
      <Title3>Users</Title3>
      {users.map((u) => (
        <User key={u.sub} data={u} />
      ))}
    </div>
  );
}
