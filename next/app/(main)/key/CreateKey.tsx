'use client';

import React, { useState } from 'react';
import { Cpu, File, Lock } from 'react-feather';
import api from '@/lib/api';
import { Dropzone } from '@/app/util';
import crypto from '@/lib/crypto';
import ErrorDialog from '@/app/dialog/Error';
import CreateKeyDialog from '@/app/dialog/CreateKey';
import { User } from 'next-auth';
import storage from '@/lib/storage';


export default function CreateKey({ user, status }: {
  status: 'unregistered' | 'no_key',
  user: User,
}) {
  const [error, setError] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);

  const uploadKey = async (publicKey: JsonWebKey) => {
    if (status === 'unregistered') {
      const { name, email } = user;
      await api.user.add(
        {
          name: name ?? '',
          email: email ?? '',
          key: { ...publicKey }
        },
      );
    }
    if (status === 'no_key') {
      await api.user.addKey({
        sub: user.sub,
        data: { ...publicKey },
        isRootKey: false,
      });
    }
    storage.update();
  };

  const onFile = async (file: File) => {
    try {
      const text = await file.text();
      const publicKey = await crypto.publicKey.fromFile(text);
      const jwk = await crypto.publicKey.toJWK(publicKey);
      await uploadKey(jwk);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.toString());
        return;
      }
      setError('Failed to read public key file');
    }
  };

  return (
    <div className="w-full">
      <ErrorDialog message={error} onClose={() => setError(null)} />
      <CreateKeyDialog
        show={showGenerate}
        onClose={() => setShowGenerate(false)}
        onSubmit={uploadKey} />
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Add a
        <span className="text-blue"> new </span>
        keypair
      </h2>
      <div className="lg:grid gap-x-6 grid-cols-2 mt-4">
        <div className="flex h-80 sm:h-64 m-2 grow items-center flex-col justify-center border-2 rounded-3xl bg-gray-100 border-blue ">
          <button
            className="px-8 py-4 text-2xl bg-blue text-white rounded-xl"
            type="button"
            onClick={() => setShowGenerate(true)}
          >
            <span className="whitespace-nowrap">
              <Cpu className="inline-block mx-3 mb-1" size={24} />
              Generate a keypair
            </span>
          </button>
          <p className="pt-3 text-gray-400">
            Use dabih to securely generate
            <br />
            your crypto keys in the browser
          </p>
        </div>
        <div className="m-2 h-80 sm:h-64">
          <Dropzone
            onFile={onFile}
            onError={(e: string) => setError(e)}
            maxSize={100 * 1024}
          >
            <div className="text-center">
              <div className="py-3 flex justify-center">
                <div className="relative">
                  <File className="" size={66} />
                  <Lock className="text-blue absolute inset-1 m-4 mt-6" strokeWidth={3} size={24} />
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-3 text-2xl rounded-xl text-white bg-blue inline-flex items-center"
              >
                <File className="mx-3" />
                Open public key file...
              </button>
              <p className="pt-3 text-gray-400">
                Add your own public key
              </p>
            </div>
          </Dropzone>
        </div>
      </div>
    </div>
  );
}
