'use client';

import React, { useEffect } from 'react';
import { Clock } from 'react-feather';
import {
  Spinner, AdminContact,
} from '@/app/util';
import { useRouter } from 'next/navigation';
import useSession from '@/app/session';
import LoadKey from './LoadKey';
import CreateKey from './CreateKey';

export default function Key() {
  const router = useRouter();
  const {
    keyStatus,
  } = useSession();

  useEffect(() => {
    if (keyStatus === 'active') {
      router.push('/manage');
      return;
    }
    if (keyStatus === 'unauthenticated') {
      router.push('/signin');
    }
  }, [keyStatus, router]);

  if (keyStatus === 'disabled') {
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
  if (keyStatus === 'unloaded') {
    return (
      <LoadKey />
    );
  }

  if (keyStatus === 'unregistered') {
    return (
      <CreateKey />
    );
  }
  // loading
  return (
    <div className="flex justify-center mt-10">
      <Spinner />
    </div>
  );
}
