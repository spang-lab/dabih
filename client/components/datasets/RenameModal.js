import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Key, RefreshCcw } from 'react-feather';
import { DeleteButton, MutedButton } from '../util';

export default function DeleteModal({ children, onDelete }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <DeleteButton onClick={() => setOpen(true)}>
        <div className="relative w-6 h-6">
          <Key size={25} />
          <RefreshCcw className="absolute left-0 top-2" size={16} />
        </div>
      </DeleteButton>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-extrabold text-gray-800 leading-6"
                  >
                    Confirm Reencryption
                  </Dialog.Title>
                  <div className="mt-2">{children}</div>

                  <div className="mt-4 text-right">
                    <MutedButton
                      onClick={() => {
                        onDelete();
                        setOpen(false);
                      }}
                      className="mx-3 text-gray-100 bg-danger hover:bg-rose-600 hover:text-white"
                    >
                      Reencrypt
                    </MutedButton>
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
    </>
  );
}
