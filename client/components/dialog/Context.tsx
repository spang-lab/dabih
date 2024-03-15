/* eslint-disable react/jsx-props-no-spreading  */

'use client';

import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  Fragment,
} from 'react';
import { Transition, Dialog } from '@headlessui/react';

import Rename from './Rename';
import Error from './Error';
import Delete from './Delete';
import Destroy from './Destroy';
import Webcam from './Webcam';
import Reencrypt from './Reencrypt';
import Generate from './generate/Generate';
import CreateToken from './CreateToken';

interface DialogContextType {
  dialog: string | null,
  ctx: any,
  closeDialog: () => void,
}

const DialogContext = createContext<DialogContextType>({
  dialog: null,
  ctx: null,
  closeDialog: () => {},
});
export const useDialog = () => useContext(DialogContext);

function DialogHelper({ children }) {
  const { closeDialog, dialog, ctx } = useDialog();

  const [shakeClass, setShake] = useState('');

  const onClose = () => {
    const shake = ctx?.shake;
    if (shake) {
      setShake('animate-shaking');
      setTimeout(() => setShake('animate-none'), 200);
      return;
    }
    closeDialog();
  };

  return (
    <Transition appear show={!!dialog} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className={shakeClass}>
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface DialogState {
  dialog: string | null,
  ctx: any,
}

export function DialogWrapper({ children }) {
  const [data, setData] = useState<DialogState>({
    dialog: null,
    ctx: null,
  });

  const contextValue = useMemo(
    () => ({
      openDialog: (dialog: string, ctx = {}) => setData({
        dialog,
        ctx,
      }),
      closeDialog: () => setData({
        dialog: null,
        ctx: null,
      }),
      ...data,
      error: (error: string) => setData({
        dialog: 'error',
        ctx: { error },
      }),
    }),
    [data, setData],
  );

  const getDialog = () => {
    const { dialog } = data;
    switch (dialog) {
      case 'rename':
        return <Rename {...contextValue} />;
      case 'error':
        return <Error {...contextValue} />;
      case 'delete':
        return <Delete {...contextValue} />;
      case 'destroy':
        return <Destroy {...contextValue} />;
      case 'webcam':
        return <Webcam {...contextValue} />;
      case 'generate':
        return <Generate {...contextValue} />;
      case 'reencrypt':
        return <Reencrypt {...contextValue} />;
      case 'create_token':
        return <CreateToken {...contextValue} />;
      case null:
        return null;

      default:
        setData({
          dialog: 'error',
          ctx: { error: `Unknown Dialog ${dialog}` },
        });
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
