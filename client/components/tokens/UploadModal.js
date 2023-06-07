import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Copy } from 'react-feather';
import { MutedButton } from '../util';

export default function TokenModal({ token, onClose, isOpen }) {
  const [baseUrl, setBaseUrl] = useState('');
  useEffect(() => setBaseUrl(window.location.origin), []);

  const getValue = () => {
    if (!token) {
      return '';
    }
    return `${baseUrl}/ingress/${token.data}`;
  };

  const copyToken = () => {
    if (!token) {
      return;
    }
    navigator.clipboard.writeText(getValue());
  };

  return (
    <Transition appear show={!!isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="pb-3 text-2xl font-extrabold text-gray-900 leading-6"
                >
                  New Upload Token
                </Dialog.Title>
                <p className="pb-3">
                  This url can be used to upload data to your account. By
                  default it will expire 72 hours after your last login.
                </p>
                <p>
                  Make sure to copy this url
                  {' '}
                  <strong>before</strong>
                  {' '}
                  closing
                  this window.
                </p>
                <div className="flex flex-row mt-2">
                  <div className="text-center">
                    <input
                      size={58}
                      className="p-2 border border-gray-400 rounded"
                      type="text"
                      readOnly
                      value={getValue()}
                    />
                  </div>
                  <div className="pl-1">
                    <MutedButton onClick={copyToken}>
                      <Copy size={24} />
                    </MutedButton>
                  </div>
                </div>
                <p>
                  This url can
                  <span className="font-semibold text-sky-700">
                    {' '}
                    no longer be accessed
                    {' '}
                  </span>
                  later, copy it now.
                </p>
                <div className="mt-4 text-right">
                  <MutedButton onClick={onClose}>Done</MutedButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
