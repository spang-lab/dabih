/* eslint-disable jsx-a11y/media-has-caption */
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Cpu } from 'react-feather';
import Generate from './Generate';
import styles from './Generate.module.css';

import { BigButton } from '../util';

export default function GenerateKey() {
  const [isOpen, setOpen] = useState(false);
  const [shake, setShake] = useState('');

  const shakeElem = () => {
    setShake(styles.shaking);
    setTimeout(() => setShake(''), 200);
  };

  return (
    <div className="items-start w-full">
      <div className="px-3 pt-2 pb-10 italic font-semibold text-left text-sky-800 text-md">
        Recommended
      </div>
      <div className="text-center">
        <BigButton onClick={() => setOpen(true)}>
          <span className="whitespace-nowrap">
            <Cpu className="inline-block mx-3 mb-1" size={24} />
            Generate a keypair
          </span>
        </BigButton>
        <p className="pt-3 text-gray-500">
          Use dabih to securely generate
          <br />
          your crypto keys in the browser
        </p>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={shakeElem}>
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
                  <Dialog.Panel
                    className={`${shake} w-full max-w-5xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all`}
                  >
                    <Dialog.Title
                      as="h2"
                      className="text-2xl font-extrabold text-gray-900 leading-6"
                    >
                      Generate a new keypair
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You
                        <span className="font-semibold text-sky-700">
                          {' '}
                          need
                          {' '}
                        </span>
                        to save your private key after generating it.
                      </p>
                    </div>
                    <Generate onComplete={() => setOpen(false)} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
