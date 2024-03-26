'use client';

import React from 'react';

import { Camera, File, Key } from 'react-feather';
import Image from 'next/image';
import crypto from '@/lib/crypto';
import storage from '@/lib/storage';
import useDialog from '@/app/dialog';
import api from '@/lib/api';
import { Dropzone } from '@/app/util';
import useSession from '@/app/session';

export default function LoadKey() {
  const { update } = useSession();
  const dialog = useDialog();

  const saveKey = async (key: CryptoKey) => {
    const hash = await crypto.privateKey.toHash(key);
    const result = await api.key.check(hash);
    if (result.error) {
      dialog.error(result.error);
      return;
    }
    await storage.storeKey(key);
    update();
  };

  const onFile = async (file: File) => {
    try {
      const text = await file.text();
      const key = await crypto.privateKey.fromPEM(text);
      await saveKey(key);
    } catch (err: any) {
      dialog.error(err.toString());
    }
  };

  const onScan = async (data: string) => {
    try {
      const key = await crypto.privateKey.fromJSON(data);
      await saveKey(key);
    } catch (err: any) {
      dialog.error(err.toString());
    }
  };

  const onError = (error: string) => dialog.error(error);

  return (
    <div className="py-12">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Load your existing key
      </h2>
      <div className="lg:grid gap-x-6 grid-cols-2 mt-4">
        <div className="h-80 sm:h-64 flex m-2 grow items-center flex-col justify-center border-2 rounded-3xl bg-gray-100 border-blue ">
          <Image
            src="/images/dabih-qr.svg"
            alt="QR Code"
            width={60}
            height={60}
          />
          <button
            className="px-4 rounded-xl text-2xl py-3 text-white bg-blue"
            type="button"
            onClick={() => dialog.openDialog('webcam', {
              onSubmit: onScan,
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
        <div className="m-2 h-80 sm:h-64">
          <Dropzone
            onFile={onFile}
            onError={onError}
            maxSize={100 * 1024}
          >
            <div className="text-center">
              <div className="py-3 flex justify-center">
                <div className="relative">
                  <File className="" size={66} />
                  <Key className="text-blue absolute inset-1 m-4 mt-6" strokeWidth={3} size={24} />
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-3 text-2xl rounded-xl text-white bg-blue inline-flex items-center"
              >
                <File className="mx-3" />
                Open key file...
              </button>
              <p className="pt-3 text-gray-400">
                This file will
                <span className="font-semibold text-blue"> not </span>
                be uploaded.
              </p>
            </div>
          </Dropzone>
        </div>
      </div>
    </div>
  );
}
