import { DialogPanel, DialogTitle } from '@headlessui/react';
import { Copy } from 'react-feather';
import { DialogShakeTransition } from './Transition';

export default function ShowTokenDialog({ token, onClose }:
  { token: string | null, onClose: () => void }) {
  const copyToken = () => navigator.clipboard.writeText(token!).catch(console.error);

  return (
    <DialogShakeTransition show={!!token} >
      <DialogPanel className="w-full max-w-2xl p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
        <DialogTitle
          as="h2"
          className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
        >
          New API Access Token
        </DialogTitle>
        <p className="pb-3">
          This token can be used by command line tools to access
          dabih functions
        </p>
        <p>
          Make sure to copy this token
          {' '}
          <strong>before</strong>
          {' '}
          closing
          this window.
        </p>
        <div className="flex flex-row items-center mt-2">
          <div className="text-center">
            <input
              size={46}
              className="p-2 border border-gray-400 text-gray-700 font-mono text-lg rounded text-center"
              type="text"
              readOnly
              value={token ?? ''}
            />
          </div>
          <div className="pl-1">
            <button
              type="button"
              className="px-2 py-1 border border-gray-700 text-gray-600 rounded-lg"
              aria-label="Copy Token"
              onClick={copyToken}
            >
              <Copy size={32} />
            </button>
          </div>
        </div>
        <p className="text-lg">
          This token can
          <span className="font-bold text-red">
            {' '}
            no longer be accessed
            {' '}
          </span>
          later, copy it now.
        </p>

        <div className="text-right">
          <button
            type="button"
            className="mx-3 px-2 py-1 text-lg text-white bg-blue rounded-lg"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </DialogPanel>
    </DialogShakeTransition>
  );
}
