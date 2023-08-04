import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  Fragment,
} from 'react';
import { Transition, Dialog } from '@headlessui/react';

import Rename from './Rename';

const DialogContext = createContext();
export const useDialog = () => useContext(DialogContext);

function DialogHelper({ children }) {
  const { closeDialog, dialog } = useDialog();
  return (
    <Transition appear show={!!dialog} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => closeDialog()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75" />
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
              <div>
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function DialogWrapper({ children }) {
  const [data, setData] = useState({
    dialog: null,
    ctx: null,
  });

  const contextValue = useMemo(
    () => ({
      openDialog: (dialog, ctx = {}) => setData({
        dialog,
        ctx,
      }),
      closeDialog: () => setData({
        dialog: null,
        ctx: null,
      }),
      ...data,
    }),
    [data, setData],
  );

  const getDialog = () => {
    const { dialog } = data;
    switch (dialog) {
      case 'rename':
        return <Rename {...contextValue} />;
      default:
        return null;
    }
  };

  return (
    <DialogContext.Provider value={contextValue}>
      <DialogHelper>
        {getDialog()}
      </DialogHelper>
      {children}
    </DialogContext.Provider>
  );
}
