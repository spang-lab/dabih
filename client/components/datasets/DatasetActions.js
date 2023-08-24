'use client';

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
  AlertTriangle,
  Repeat,
} from 'react-feather';
import { useRouter } from 'next/navigation';
import { useUser } from '../hooks';
import { useDatasets } from './Context';
import { MutedButton } from '../util';
import useDialog from '../dialog';

function ConfirmDialog(props) {
  const {
    onConfirm, onClose, isOpen, children, title, red,
  } = props;
  const className = red ? 'bg-red hover:bg-rose-600' : 'bg-blue hover:bg-blue';

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
                  className="text-2xl font-extrabold text-gray-800 leading-6"
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
  children, enabled, onClick, show = true,
}) {
  if (!show) {
    return null;
  }
  const getClass = (active) => {
    if (!enabled) {
      return 'text-gray-400';
    }
    if (active) {
      return 'bg-blue text-white';
    }
    return 'text-blue';
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          type="button"
          disabled={!enabled}
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
  const { permission, mnemonic, deletedAt } = data;
  const { openDialog } = useDialog();
  const router = useRouter();
  const hasWrite = permission === 'write';
  const user = useUser();

  const [dialog, setDialog] = useState(null);
  const {
    removeDataset,
    reencryptDataset,
    renameDataset,
    destroyDataset,
    recoverDataset,
  } = useDatasets();
  const isAdmin = user ? user.isAdmin : false;

  return (
    <div className="text-right ">
      <ConfirmDialog
        title="Confirm reencrypt"
        isOpen={dialog === 'reencrypt'}
        onClose={() => setDialog(null)}
        onConfirm={() => reencryptDataset(mnemonic)}
      >
        <p className="text-gray-400">
          Are you sure you want to reencrypt the Dataset
        </p>
        <span className="font-semibold text-blue">
          {' '}
          {mnemonic}
          {' '}
        </span>
        <p className="text-gray-400">
          This is only useful if a dabih was lost or stolen.
        </p>
      </ConfirmDialog>
      <ConfirmDialog
        title="Confirm delete"
        onClose={() => setDialog(null)}
        isOpen={dialog === 'delete'}
        onConfirm={() => removeDataset(mnemonic)}
      >
        <p className="text-gray-400">
          Are you sure you want to delete the Dataset
        </p>
        <span className="font-semibold text-blue">
          {' '}
          {mnemonic}
          {' '}
        </span>
      </ConfirmDialog>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="z-0 inline-flex border-gray-400 mx-1 justify-center w-full px-2 py-1 text-sm font-extrabold border rounded text-blue hover:text-blue">
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
                className="text-blue"
                enabled
              >
                <Download className="mx-2" size={24} />
                Download
              </Action>
              <Action
                onClick={() => openDialog('rename', {
                  dataset: data,
                  onSubmit: (name) => renameDataset(mnemonic, name),
                })}
                enabled={hasWrite}
              >
                <Edit3 className="mx-2" size={24} />
                Rename
              </Action>
              <Action
                show={!!deletedAt && isAdmin}
                onClick={() => recoverDataset(mnemonic)}
                enabled={hasWrite || isAdmin}
              >
                <div className="inline-flex items-center">
                  <Repeat className="mx-2" size={24} />
                  Undo Deletion
                </div>
              </Action>
              <div className="pt-2 mt-2 border-t">
                <span className="text-xs font-extrabold text-center">
                  Danger
                </span>
                <Action
                  onClick={() => setDialog('reencrypt')}
                  className="text-red"
                  enabled={hasWrite}
                >
                  <div className="relative w-6 h-6 mx-2">
                    <Key size={25} />
                    <RefreshCcw className="absolute left-0 top-2" size={16} />
                  </div>
                  Reencrypt
                </Action>
                <Action
                  show={!deletedAt}
                  onClick={() => openDialog('delete', {
                    type: 'Dataset',
                    name: mnemonic,
                    onSubmit: () => removeDataset(mnemonic),
                  })}
                  enabled={hasWrite || isAdmin}
                >
                  <div className="text-red inline-flex items-center">
                    <Trash2 className="mx-2" size={24} />
                    Delete
                  </div>
                </Action>
                <Action
                  show={!!deletedAt && isAdmin}
                  onClick={() => openDialog('destroy', {
                    type: 'Dataset',
                    name: mnemonic,
                    onSubmit: () => destroyDataset(mnemonic),
                  })}
                  enabled={hasWrite || isAdmin}
                >
                  <div className="text-red inline-flex items-center font-bold text-sm">
                    <div className="relative w-6 h-6 mx-1">
                      <Trash2 size={24} />
                      <AlertTriangle
                        className="absolute -bottom-1 -right-1"
                        size={14}
                      />
                    </div>
                    Destroy forever
                  </div>
                </Action>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
