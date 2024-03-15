'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Copy } from 'react-feather';
import { useProfile } from './Context';

export default function TokenModal() {
  const [baseUrl, setBaseUrl] = useState('');
  useEffect(() => setBaseUrl(window.location.origin), []);
  const { token, clearToken } = useProfile();
  const [shake, setShake] = useState('');

  const shakeElem = () => {
    setShake('.shaking');
    setTimeout(() => setShake(''), 200);
  };
  const getValue = () => {
    if (!token) {
      return '';
    }
    if (token.scopes[0] === 'api') {
      return token.token;
    }
    return `${baseUrl}/ingress/${token.token}`;
  };

  const copyToken = () => {
    if (!token) {
      return;
    }
    navigator.clipboard.writeText(getValue());
  };
  const getText = () => {
    if (!token) {
      return null;
    }
    if (token.scopes[0] === 'api') {
      return (
        <>
          <Dialog.Title
            as="h2"
            className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
          >
            New Access Token
          </Dialog.Title>
          <p className="pb-3">
            This token can be used by command line tools to validate your
            identity, By default it will expire 72 hours after your last login.
          </p>
        </>
      );
    }
    return (
      <>
        <Dialog.Title
          as="h2"
          className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
        >
          New Upload Token
        </Dialog.Title>
        <p className="pb-3">
          This url can be used to upload data to your account. By default it
          will expire 72 hours after your last login.
        </p>
      </>
    );
  };

  return (
    <Transition appear show={!!token} as={Fragment}>
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
              <Dialog.Panel
                className={`${shake} w-full max-w-2xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all`}
              >
                {getText()}
                <p>
                  Make sure to copy this token
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
                    <button
                      type="button"
                      onClick={copyToken}
                    >
                      <Copy size={24} />
                    </button>
                  </div>
                </div>
                <p>
                  This token can
                  <span className="font-semibold text-blue">
                    {' '}
                    no longer be accessed
                    {' '}
                  </span>
                  later, copy it now.
                </p>
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={clearToken}
                  >
                    Done

                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
