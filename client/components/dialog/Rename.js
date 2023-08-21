import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function Rename({ ctx, closeDialog }) {
  const [name, setName] = useState(ctx.name || '');

  const { dataset, onSubmit } = ctx;
  const { mnemonic } = dataset;

  const submitName = async (e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(name);
    closeDialog();
  };

  return (
    <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-gray-800 leading-6"
      >
        Rename
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-gray-400">Set a new name for the dataset</p>
        <span className="font-semibold text-blue">
          {' '}
          {mnemonic}
          {' '}
        </span>
        <form onSubmit={submitName}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 my-1 border border-gray-400 rounded"
          />
        </form>
      </div>

      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={submitName}
          className="mx-3 px-3 py-2 rounded bg-blue text-gray-100 hover:text-white"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={closeDialog}
          className="mx-3 px-3 py-2 rounded bg-gray-500 text-gray-100 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
