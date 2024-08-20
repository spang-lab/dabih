'use client';

import { Dialog } from '@headlessui/react';

export default function Reencrypt({ ctx, closeDialog }) {
  const { onSubmit, mnemonic } = ctx;

  const submit = () => {
    if (onSubmit) {
      onSubmit();
    }
    closeDialog();
  };

  return (
    <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-gray-800 leading-6"
      >
        Confirm
        <span className="pl-2 text-red">
          Deletion
        </span>
      </Dialog.Title>
      <div className="pt-2">
        Are you sure you want to reencrypt the Dataset
      </div>
      <div className="py-2 font-semibold text-blue">
        {mnemonic}
      </div>
      <p className="text-gray-400">
        This is only useful if a key was lost or stolen.
      </p>

      <div className="text-right">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-gray-100 bg-red hover:text-white rounded-md"
          onClick={submit}
        >
          Reencrypt
        </button>
        <button
          type="button"
          className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
