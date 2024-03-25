'use client';

import React from 'react';
import { Cpu } from 'react-feather';
import api from '@/lib/api';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';
import DropPublicKey from './DropPublicKey';

export default function CreateKey({ onChange }) {
  const dialog = useDialog();
  const {
    user, status,
  } = useSession();

  const onGenerate = async (publicKey: string, error?: string) => {
    if (status !== 'authenticated' || !user) {
      return;
    }
    const { name, email } = user;
    if (error) {
      dialog.error(error);
      return;
    }
    await api.key.add({
      isRootKey: false,
      key: publicKey,
      name,
      email,
    });
    onChange();
  };
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Add a
        <span className="text-blue"> new </span>
        keypair
      </h2>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-6">
            <div className="flex items-center flex-col text-center justify-center w-full border-2 rounded-xl h-80 bg-gray-100 border-blue sm:h-64">
              <button
                className="px-8 py-4 text-2xl bg-blue text-white rounded-xl"
                type="button"
                onClick={() => dialog.openDialog('generate', {
                  shake: true,
                  onSubmit: onGenerate,
                })}
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
            <div className="flex items-stretch justify-center w-full border-2 rounded-xl h-80 bg-gray-100 border-blue sm:h-64">
              <DropPublicKey onKey={onChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
