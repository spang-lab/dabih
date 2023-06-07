import React, { Fragment, useState } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import {
  ChevronDown,
  Trash2,
  Key,
  RefreshCcw,
  Download,
  Edit3,
  Settings,
} from 'react-feather';
import { useRouter } from 'next/router';
import { useDatasets } from './Context';
import { MutedButton } from '../util';

function ConfirmDialog(props) {
  const {
    onConfirm, onClose, isOpen, children, title, danger,
  } = props;
  const className = danger
    ? 'bg-rose-700 hover:bg-rose-600'
    : 'bg-sky-700 hover:bg-sky-600';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                  className="text-2xl font-extrabold text-gray-900 leading-6"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">{children}</div>

                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`mx-3 px-3 py-2 rounded text-gray-100 ${className} hover:text-white`}
                  >
                    {title}
                  </button>
                  <MutedButton onClick={onClose}>Cancel</MutedButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Action({
  children, enabled, className, onClick,
}) {
  const getClass = (active) => {
    if (!enabled) {
      return 'text-gray-300';
    }
    if (active) {
      return 'bg-sky-700 text-white';
    }
    return className;
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          type="button"
          className={`${getClass(active)} 
          group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export default function Actions({ data }) {
  const { permission, mnemonic } = data;
  const router = useRouter();

  const enabled = permission === 'write';

  const [dialog, setDialog] = useState(null);
  const { removeDataset, reencryptDataset, renameDataset } = useDatasets();
  const [name, setName] = useState(data.name || '');

  const submitName = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setDialog(null);
    await renameDataset(mnemonic, name);
  };

  return (
    <div className="text-right ">
      <ConfirmDialog
        title="Rename"
        isOpen={dialog === 'rename'}
        onClose={() => setDialog(null)}
        onConfirm={() => submitName()}
      >
        <p className="text-gray-500">Set a new name for the dataset</p>
        <span className="font-semibold text-sky-700">
          {' '}
          {mnemonic}
          {' '}
        </span>
        <form onSubmit={submitName}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 my-1 border border-gray-300 rounded"
          />
        </form>
      </ConfirmDialog>
      <ConfirmDialog
        title="Confirm reencrypt"
        isOpen={dialog === 'reencrypt'}
        onClose={() => setDialog(null)}
        onConfirm={() => reencryptDataset(mnemonic)}
      >
        <p className="text-gray-500">
          Are you sure you want to reencrypt the Dataset
        </p>
        <span className="font-semibold text-sky-700">
          {' '}
          {mnemonic}
          {' '}
        </span>
        <p className="text-gray-500">
          This is only useful if a dabih was lost or stolen.
        </p>
      </ConfirmDialog>
      <ConfirmDialog
        title="Confirm delete"
        onClose={() => setDialog(null)}
        isOpen={dialog === 'delete'}
        onConfirm={() => removeDataset(mnemonic)}
      >
        <p className="text-gray-500">
          Are you sure you want to delete the Dataset
        </p>
        <span className="font-semibold text-sky-700">
          {' '}
          {mnemonic}
          {' '}
        </span>
      </ConfirmDialog>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="z-0 inline-flex justify-center w-full px-2 py-1 text-sm font-extrabold border rounded text-sky-700 hover:text-sky-600">
            <Settings size={20} />
            <ChevronDown size={20} aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-40 mt-2 bg-white shadow-lg origin-top-right divide-y divide-gray-100 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Action
                onClick={() => {
                  router.push(`/download/${mnemonic}`);
                }}
                className="text-sky-700"
                enabled
              >
                <Download className="mx-2" size={24} />
                Download
              </Action>
              <Action
                onClick={() => setDialog('rename')}
                className="text-sky-700"
                enabled={enabled}
              >
                <Edit3 className="mx-2" size={24} />
                Rename
              </Action>
              <div className="pt-2 mt-2 border-t">
                <span className="text-xs font-extrabold text-center">
                  Danger
                </span>
                <Action
                  onClick={() => setDialog('reencrypt')}
                  className="text-rose-700"
                  enabled={enabled}
                >
                  <div className="relative w-6 h-6 mx-2">
                    <Key size={25} />
                    <RefreshCcw className="absolute left-0 top-2" size={16} />
                  </div>
                  Reencrypt
                </Action>
                <Action
                  onClick={() => setDialog('delete')}
                  className="text-rose-700"
                  enabled={enabled}
                >
                  <Trash2 className="mx-2" size={24} />
                  Delete
                </Action>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
