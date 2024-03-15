'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Clock } from 'react-feather';
import {
  Spinner, AdminContact,
} from '@/components';
import { useKey, useUser } from '@/lib/hooks';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import LoadKey from './LoadKey';
import CreateKey from './CreateKey';

export default function Key() {
  const user = useUser();
  const key = useKey();
  const router = useRouter();
  const [state, setState] = useState('loading');

  const setKeyState = useCallback(async () => {
    if (user.status !== 'authenticated') {
      setState('loading');
      return;
    }
    if (key) {
      router.push('/manage');
      return;
    }

    const keys = await api.key.list();
    const match = keys
      .filter((k) => !k.isRootKey)
      .find((u) => u.sub === user.sub);
    if (!match) {
      setState('no_key');
      return;
    }
    if (match.enabled) {
      setState('has_key');
      return;
    }
    setState('unconfirmed_key');
  }, [user, key, router]);

  useEffect(() => {
    setKeyState();
  }, [user, setKeyState]);

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
      <LoadKey onChange={setKeyState} />
    );
  }

  if (state === 'no_key') {
    return (
      <CreateKey onChange={setKeyState} />
    );
  }
  // loading
  return (
    <div className="flex justify-center mt-10">
      <Spinner />
    </div>
  );
}
