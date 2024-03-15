'use client';

import React from 'react';
import { Trash2, Key } from 'react-feather';
import { Switch } from '@headlessui/react';
import { useDialog, LocalDate } from '@/components';
import { useProfile } from '../Context';

export default function KeyElem({ data }) {
  const {
    id, name, sub, email, hash, enabled, createdAt, isRootKey,
  } = data;
  const { enableKey, deleteKey } = useProfile();
  const { openDialog } = useDialog();
  const isEnabled = !!enabled || isRootKey;
  const toggle = async () => {
    if (isRootKey) {
      return;
    }
    await enableKey(id, !isEnabled);
  };

  const getState = () => {
    if (isEnabled) {
      return <div className="px-2 font-bold text-green">Active</div>;
    }
    return <div className="px-2 font-bold text-gray-500">disabled</div>;
  };

  const getSwitch = () => {
    if (isRootKey) {
      return (
        <div className="text-lg text-gray-500 mx-2 italic">
          Root key
        </div>
      );
    }
    return (
      <div className="flex flex-row items-center border-x px-1 mx-1">
        <Switch
          checked={isEnabled}
          onChange={toggle}
          className={`${isEnabled ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden="true"
            className={`${isEnabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        {getState()}
      </div>
    );
  };

  const getModal = () => (
    <button
      type="button"
      className="py-1 px-1 bg-red text-white rounded-md inline-flex items-center"
      onClick={() => openDialog('delete', {
        type: 'Public Key',
        name,
        onSubmit: () => deleteKey(id),
      })}
    >
      <Trash2 size={24} className="pr-1" />
      <div className="text-xs font-bold">
        Delete
      </div>
    </button>
  );

  const getIcon = () => {
    if (isRootKey) {
      return <Key className="text-red" size={24} strokeWidth={3} />;
    }
    return <Key className="text-blue" size={24} />;
  };

  return (
    <div className="flex flex-wrap items-center p-1 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="shrink-0 justify-self-start">
        {getIcon()}
      </div>
      <div className="">
        <div className="font-medium text-black">
          {name}
          <a className="text-blue pl-1 font-bold" href={`mailto:${email}`}>
            {email}
          </a>
          <span className="text-gray-500 pl-1">
            (id:
            {' '}
            {sub}
            )
          </span>
        </div>
      </div>
      <div className="px-1 text-gray-500 font-light">
        <LocalDate value={createdAt} />
      </div>
      <div className="text-gray-400 text-xs">{hash}</div>
      <div className="grow" />
      <div className="flex flex-row items-center">
        {getSwitch()}
      </div>
      <div className="">{getModal()}</div>
    </div>
  );
}
