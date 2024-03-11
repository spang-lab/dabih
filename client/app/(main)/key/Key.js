'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'react-feather';
import {
  Spinner, useUsers, useUser, AdminContact,
} from '@/components';
import LoadKey from './LoadKey';
import CreateKey from './CreateKey';

export default function Key() {
  const { users, fetchUsers } = useUsers();
  const user = useUser();
  const [state, setState] = useState('loading');

  useEffect(() => {
    if (!user || !users) {
      return;
    }
    const match = users.find((u) => u.sub === user.sub);
    if (!match) {
      setState('no_key');
      return;
    }
    if (match.confirmed) {
      setState('has_key');
      return;
    }
    setState('unconfirmed_key');
  }, [user, users]);

  if (state === 'unconfirmed_key') {
    return (
      <div className="py-10 text-center">
        <Clock className="inline-block m-2 text-blue" size={80} />
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Please
          <span className="text-blue"> wait for an admin </span>
          to confirm your key
        </h2>
        <div className="text-base text-gray-400 sm:text-lg md:text-xl">
          In order to prevent misuse each new key must be
          <span className="text-blue"> unlocked </span>
          by a dabih admin.
          <br />
          For now please contact the admin via email:
        </div>
        <AdminContact />
      </div>
    );
  }
  if (state === 'has_key') {
    return (
      <LoadKey onChange={fetchUsers} />
    );
  }

  if (state === 'no_key') {
    return (
      <CreateKey onChange={fetchUsers} />
    );
  }
  // loading
  return (
    <div className="flex justify-center mt-10">
      <Spinner />
    </div>
  );
}
