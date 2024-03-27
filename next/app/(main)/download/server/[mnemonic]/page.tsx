'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import crypto from '@/lib/crypto';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';

export default function Download() {
  const { mnemonic } = useParams<{ mnemonic: string }>();
  const dialog = useDialog();
  const router = useRouter();
  const { key } = useSession();

  useEffect(() => {
    (async () => {
      if (!key) {
        return;
      }
      const keyHash = await crypto.privateKey.toHash(key);
      const result = await api.dataset.key(mnemonic, keyHash);
      if (result.error) {
        dialog.error(result.error);
        return;
      }
      const buffer = await crypto.privateKey.decryptAesKey(key, result.key);
      const aesKey = await crypto.aesKey.fromUint8(buffer);
      const base64 = await crypto.aesKey.toBase64(aesKey);
      const { error } = await api.dataset.storeKey(mnemonic, base64);
      if (error) {
        dialog.error(result.error);
      }
      router.push(`/api/v1/dataset/${mnemonic}/download`);
    })();
  }, [mnemonic, router, dialog, key]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold">
        {' '}
        Your
        <span className="text-blue px-2">download</span>
        should start immediately
      </h1>
      <p className="text-xl text-gray-600 py-5">
        If it did not start click
        {' '}
        <a
          className="text-blue font-bold hover:underline"
          target="_blank"
          href={`/api/v1/dataset/${mnemonic}/download`}
        >
          here
        </a>
        {' '}
        to download the file.

      </p>

      <p className="pt-10">
        <Link className="text-blue text-2xl hover:underline" href="/manage">
          Go Back
        </Link>
      </p>

    </div>
  );
}
