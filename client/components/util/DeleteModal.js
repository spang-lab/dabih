import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2 } from 'react-feather';

export default function DeleteModal({ children, onDelete, type }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="pt-1 px-2 bg-red text-white rounded-md"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={24} className="flex justify-self-center" />
        <div className="text-[10px] font-bold">
          Delete
        </div>
      </button>
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
            <div className="flex items-center justify-center min-h-full p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
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
                    Are you sure you want to delete the
                    {' '}
                    <span className="font-semibold text-blue">{type}</span>
                  </div>
                  <div className="py-2 font-semibold text-blue">
                    {children}
                  </div>

                  <div className=" text-right">
                    <button
                      type="button"
                      className="mx-3 px-2 py-1 text-gray-100 bg-red hover:text-white rounded-md"
                      onClick={() => {
                        onDelete();
                        setOpen(false);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
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
