'use client';

import React from 'react';

import { Camera } from 'react-feather';
import Image from 'next/image';
import crypto from '@/lib/crypto';
import storage from '@/lib/storage';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import useDialog from '@/app/dialog';
import DropPrivateKey from './DropPrivateKey';

export default function LoadKey() {
  const dialog = useDialog();
  const router = useRouter();

  const onKey = async (data: string) => {
    try {
      const key = await crypto.privateKey.fromJSON(data);
      const hash = await crypto.privateKey.toHash(key);
      const { status, error } = await api.key.check(hash);
      if (status !== 'active') {
        dialog.error(error);
      }
      await storage.storeKey(key);
      router.push('/manage');
    } catch (err: any) {
      dialog.error(err.toString());
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Load your existing key
      </h2>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-6">
            <div className="flex items-center flex-col text-center justify-center w-full border-2 rounded-xl h-80 bg-gray-100 border-blue sm:h-64">
              <div className="m-3">
                <Image
                  className="mx-auto"
                  src="/images/dabih-qr.svg"
                  alt="QR Code"
                  width={50}
                  height={50}
                />
              </div>
              <button
                className="px-4 rounded-xl text-2xl py-3 text-white bg-blue"
                type="button"
                onClick={() => dialog.openDialog('webcam', {
                  onSubmit: onKey,
                })}
              >
                <span className="whitespace-nowrap">
                  <Camera className="inline-block mx-3 mb-1" size={24} />
                  Open camera
                </span>
              </button>
              <p className="pt-3 text-gray-400">
                Use your computers webcam to scan
                <br />
                your key from a QR Code
              </p>
            </div>
            <div className="flex items-center flex-col text-center justify-center w-full border-2 rounded-xl h-80 bg-gray-100 border-blue sm:h-64">
              <DropPrivateKey />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
