import { Dialog } from '@headlessui/react';
import { AdminContact } from '../branding';

export default function Error({ ctx, closeDialog }) {
  const { error } = ctx;

  return (
    <Dialog.Panel className="w-full max-w-xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-red leading-6"
      >
        Error
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-gray-600">Dabih encountered an Error</p>
        <p className="font-semibold text-red my-3">{error}</p>
        <p className="text-gray-600">For help please contact an admin</p>
        <AdminContact />
      </div>

      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={closeDialog}
          className="mx-3 px-3 py-2 rounded bg-gray-500 text-gray-100 hover:text-white"
        >
          Ok
        </button>
      </div>
    </Dialog.Panel>
  );
}
