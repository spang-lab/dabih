/* eslint-disable jsx-a11y/media-has-caption */
import React, {
  Fragment, useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Camera } from 'react-feather';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { BigButton, MutedButton } from '../util';
import { storage, importPrivateKey } from '../../lib';

import Webcam from './Webcam';
import { useMessages } from '../messages';
import { useApi } from '../api';

export default function WebcamScan() {
  const [isOpen, setOpen] = useState(false);
  const log = useMessages();
  const api = useApi();
  const router = useRouter();

  const onCode = async (code) => {
    setOpen(false);
    const array = Uint8Array.from(code.bytes);
    try {
      const keys = await importPrivateKey(array, 'uint8array');
      const { valid, error } = await api.checkPublicKey(keys.hash);
      if (!valid) {
        log.error(error);
        return;
      }
      await storage.storeKey(keys.privateKey);
      router.push('/manage');
    } catch (err) {
      log.error('Did not find a valid dabih key in the scanned code');
    }
  };

  const onError = (err) => {
    setOpen(false);
    log.error(err);
  };

  return (
    <div className="text-center">
      <div className="m-3">
        <Image className="mx-auto" src="/images/dabih-qr.svg" alt="QR Code" width={50} height={50} />
      </div>
      <BigButton onClick={() => setOpen(true)}>
        <span className="whitespace-nowrap">
          <Camera className="inline-block mx-3 mb-1" size={24} />
          Open camera
        </span>
      </BigButton>
      <p className="pt-3 text-gray-500">
        Use your computers webcam to scan
        <br />
        your key from a QR Code
      </p>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-extrabold text-gray-900 leading-6"
                  >
                    Scan your code
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Make sure to position your QR code in the marked region.

                    </p>
                  </div>
                  <Webcam onCode={onCode} onError={onError} />

                  <div className="mt-4">
                    <MutedButton onClick={() => setOpen(false)}>
                      Cancel
                    </MutedButton>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
