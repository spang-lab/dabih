'use client';

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
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
  DownloadCloud,
} from 'react-feather';
import { useRouter } from 'next/navigation';
import useDatasets from '@/lib/hooks/datasets';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';

function Action({
  children, enabled, onClick, show = true,
}) {
  if (!show) {
    return null;
  }
  const getClass = (active: boolean) => {
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
  const { isAdmin } = useSession();
  const dataset = useDatasets();

  const canDownload = !deletedAt && permission !== 'none';

  return (
    <div className="text-right ">
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
                  router.push(`/download/client/${mnemonic}`);
                }}
                enabled={canDownload}
              >
                <Download className="mx-2" size={24} />
                Download
              </Action>
              <Action
                onClick={() => {
                  router.push(`/download/server/${mnemonic}`);
                }}
                enabled={canDownload}
              >
                <DownloadCloud className="mx-2" size={24} />
                <div>
                  Download
                  <p className="text-xs"> (server decrypt) </p>
                </div>
              </Action>
              <Action
                onClick={() => openDialog('rename', {
                  dataset: data,
                  onSubmit: (name: string) => dataset.rename(mnemonic, name),
                })}
                enabled={hasWrite}
              >
                <Edit3 className="mx-2" size={24} />
                Rename
              </Action>
              <Action
                show={!!deletedAt && isAdmin}
                onClick={() => dataset.recover(mnemonic)}
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
                  onClick={() => openDialog('reencrypt', {
                    mnemonic,
                    onSubmit: () => dataset.reencrypt(mnemonic),
                  })}
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
                    onSubmit: () => dataset.remove(mnemonic),
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
                    onSubmit: () => dataset.destroy(mnemonic),
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
