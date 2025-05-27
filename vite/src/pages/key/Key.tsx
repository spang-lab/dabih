'use client';

import React, { useEffect } from 'react';
import { Clock } from 'react-feather';
import {
  Spinner,
} from '@/app/util';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadKey from './LoadKey';
import CreateKey from './CreateKey';
import useKey from '@/lib/hooks/key';
import { User } from 'next-auth';

export default function Key({ user }: { user: User }) {
  const router = useRouter();
  const key = useKey();
  const { status } = key;

  useEffect(() => {
    if (status === 'active') {
      router.push('/manage');
      return;
    }
  }, [status, router]);

  if (status === 'no_enabled_key' || status === 'disabled') {
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
          <span className="text-blue"> enabled </span>
          by a dabih admin.
          <br />
          For now please contact the admin
        </div>
        <Link className="text-blue text-lg font-bold hover:underline" href="/docs/contact">Contact</Link>
      </div>
    );
  }
  if (status === 'unloaded') {
    return (
      <LoadKey />
    );
  }

  if (status === 'unregistered' || status === 'no_key') {
    return (
      <CreateKey user={user} status={status} />
    );
  }
  return (
    <div className="flex justify-center mt-10">
      <Spinner />
    </div>
  );
}
