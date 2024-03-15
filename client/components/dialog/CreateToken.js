'use client';

import { useUser } from '@/lib/hooks';
import { Dialog } from '@headlessui/react';
import { Copy } from 'react-feather';

export default function CreateToken({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const user = useUser();

  const submit = () => {
    if (onSubmit) {
      onSubmit();
    }
    closeDialog();
  };

  if (user.status !== 'authenticated') {
    return null;
  }

  return (
    <Dialog.Panel className="w-full max-w-lg p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
      <Dialog.Title
        as="h2"
        className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
      >
        New Access Token
      </Dialog.Title>
      <p className="pb-3">
        This token can be used by command line tools to perform
        actions in
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <h3 className="text-xl font-extrabold">Scopes</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <div className="text-right">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-lg font-bold text-gray-100 bg-blue hover:text-white rounded-md"
          onClick={submit}
        >
          Generate
        </button>
        <button
          type="button"
          className="mx-3 px-2 py-1 text-lg text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
