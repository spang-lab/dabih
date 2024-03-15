'use client';

import React from 'react';
import { RefreshCw, Trash2, User } from 'react-feather';
import { Switch } from '@headlessui/react';
import { useDatasets } from './Context';

export default function Member({ data, dataset }) {
  const { mnemonic } = dataset;
  const {
    sub, name, email, permission, disabled,
  } = data;
  const { setAccess, addMembers } = useDatasets();
  const enabled = permission === 'write';
  const removed = permission === 'none';
  const canEdit = dataset.permission === 'write';

  const toggle = async () => {
    if (!canEdit || disabled) {
      return;
    }
    if (enabled) {
      await setAccess(mnemonic, sub, 'read');
    } else {
      await setAccess(mnemonic, sub, 'write');
    }
  };
  const onDelete = async () => setAccess(mnemonic, sub, 'none');

  const getSwitch = () => {
    if (removed) {
      return (
        <span className="px-3 font-semibold text-gray-400 whitespace-nowrap">
          Access removed
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => addMembers(mnemonic, [sub])}
            className="inline-flex items-center rounded-md bg-blue disabled:bg-blue/40 text-white px-2 py-1 ml-2"
          >
            <RefreshCw className="mr-2" size={14} />
            Restore
          </button>
        </span>
      );
    }
    if (!canEdit || disabled) {
      return <span className="px-3 text-gray-400">{permission}</span>;
    }

    return (
      <>
        <div className="text-xs text-center">Can edit</div>
        <div className="px-2 text-center justify-self-end">
          <Switch
            checked={enabled}
            onChange={toggle}
            className={`${enabled ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">User write permission</span>
            <span
              aria-hidden="true"
              className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
      </>
    );
  };

  const getDelete = () => {
    if (!canEdit || removed || disabled) {
      return null;
    }
    return (
      <div>
        <button
          type="button"
          label="Delete Member"
          className="bg-red px-2 py-1 rounded-lg"
          onClick={onDelete}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex items-center mx-auto text-sm bg-white border-b border-gray-400 space-x-4">
      <div className="px-2 shrink-0 text-blue justify-self-start">
        <User size={20} />
      </div>
      <div className="font-semibold text-blue py-2">{name}</div>
      <div className="">{email}</div>
      <div className="text-gray-800">
        (id:
        {' '}
        {sub}
        )
      </div>
      <div className="grow" />
      {getDelete()}
      {getSwitch()}
    </div>
  );
}
