'use client';

import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  LogOut, User, Key, XCircle,
} from 'react-feather';
import storage from '@/lib/storage';
import crypto from '@/lib/crypto';
import Link from 'next/link';
import { LocalDate } from '@/app/util';
import useSession from '@/app/session';

function CryptoKey() {
  const { key, update } = useSession();
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!key) {
        setHash(null);
        return;
      }
      setHash(await crypto.privateKey.toHash(key));
    })();
  }, [key]);

  if (!key) {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-gray-700 text-white font-extrabold rounded-full px-2 py-1 mx-3">
          not loaded
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Go to the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            href="/key"
          >
            <Key className="mr-1" />
            Key page
          </Link>
          to load a private key.
        </div>
      </div>
    );
  }
  return (
    <div className="flex grow flex-row flex-wrap justify-between items-center">
      <div className="bg-green text-white font-extrabold rounded-full px-2 py-1 mx-3">
        loaded
      </div>
      <div>
        <span>Fingerprint:</span>
        {' '}
        <span className="text-sm font-mono">{hash}</span>
      </div>
      <div className="text-gray-500">
        Saved in browser local storage
      </div>
      <div>
        <button
          type="button"
          className="bg-blue text-white py-1 px-2 rounded-md inline-flex items-center"
          onClick={() => {
            storage.deleteKey();
            update();
          }}
        >
          <XCircle className="mr-2" />
          Unload
        </button>
      </div>
    </div>
  );
}

export default function Account() {
  const {
    user, status, isAdmin, expires,
  } = useSession();

  if (status !== 'authenticated' || !user) {
    return null;
  }
  const {
    sub, name, email, scopes,
  } = user;

  return (
    <div>
      <div className="border rounded-xl border-gray-400 m-2 p-2 flex flex-row flex-wrap items-center justify-between">
        <div className="inline-flex items-center text-blue font-extrabold text-xl">
          <User className="text-blue mx-3" size={34} />
          Account
        </div>
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
        <div className="px-2 bg-blue rounded-full py-1 text-white font-extrabold mx-2">
          {(isAdmin) ? 'Admin' : 'User'}
        </div>
        <div className="text-sm px-2">
          <p className="text-gray-500">
            Session expires:
          </p>
          <LocalDate value={expires} showTime />
        </div>
        <div>
          Scopes:
          {scopes.map((s) => (
            <span
              key={s}
              className="border text-sm font-mono rounded-full px-2 py-1 mx-1"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="grow flex justify-end">
          <button
            type="button"
            className="bg-blue text-white py-1 px-2 rounded-md inline-flex items-center"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="border rounded-xl border-gray-400 m-2 p-2 flex flex-row flex-wrap items-center">
        <div className="inline-flex items-center text-blue font-extrabold text-xl">
          <Key className="text-blue mx-3" size={34} />
          RSA Private Key
        </div>
        <CryptoKey />
      </div>
    </div>
  );
}
