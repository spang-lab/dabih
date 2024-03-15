'use client';

import { Dialog } from '@headlessui/react';
import { Copy } from 'react-feather';

export default function ApiToken({ ctx, closeDialog }) {
  const { onSubmit, token } = ctx;

  const submit = () => {
    if (onSubmit) {
      onSubmit();
    }
    closeDialog();
  };

  const copyToken = () => {
    if (!token) {
      return;
    }
    navigator.clipboard.writeText(token);
  };

  return (
    <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
      <Dialog.Title
        as="h2"
        className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
      >
        New API Access Token
      </Dialog.Title>
      <p className="pb-3">
        This token can be used by command line tools to validate your
        identity.
      </p>
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
            value={token}
          />
        </div>
        <div className="pl-1">
          <button
            type="button"
            aria-label="Copy Token"
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

      <div className="text-right">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-gray-100 bg-red hover:text-white rounded-md"
          onClick={submit}
        >
          Delete
        </button>
        <button
          type="button"
          className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Done
        </button>
      </div>
    </Dialog.Panel>
  );
}
