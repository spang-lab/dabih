'use client';

import React from 'react';
import { Trash2, Key } from 'react-feather';
import { Switch, useDialog, LocalDate } from '@/components';
import { useUser } from '@/lib/hooks';

export default function PublicKey({ data, onRemove, onEnable }) {
  const {
    name, sub, email, hash, enabled, createdAt, isRootKey,
  } = data;
  const { openDialog } = useDialog();
  const user = useUser();
  const isEnabled = !!enabled || isRootKey;

  const getState = () => {
    if (isEnabled || isRootKey) {
      return <div className="px-2 font-bold text-green">Active</div>;
    }
    return <div className="px-2 font-bold text-gray-500">Disabled</div>;
  };

  const getSwitch = () => {
    if (isRootKey || user.status !== 'authenticated' || !user.isAdmin) {
      return null;
    }

    return (
      <div className="flex flex-row items-center px-1 mx-1">
        <Switch enabled={enabled} onChange={() => onEnable(!isEnabled)} />
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
        onSubmit: onRemove,
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
      return (
        <div className="inline-flex px-2 py-1 bg-blue shrink-0 items-center text-white rounded-full font-extrabold text-xl">
          <Key className="mr-3" size={24} strokeWidth={3} />
          Root Key
        </div>
      );
    }
    return (
      <div className="inline-flex px-2 py-1 shrink-0 items-center text-blue font-extrabold text-xl">
        <Key className="mr-3" size={24} strokeWidth={3} />
        Public Key
      </div>
    );
  };

  return (
    <div className="flex items-center flex-wrap p-1 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      {getIcon()}
      <div className="font-medium text-black">
        {name}
      </div>
      <div>
        <a className="text-blue pl-1 font-bold" href={`mailto:${email}`}>
          {email}
        </a>
      </div>
      <div className="text-gray-500 pl-1">
        (id:
        {' '}
        {sub}
        )
      </div>
      <div className="px-1 text-gray-500 font-light">
        <LocalDate value={createdAt} />
      </div>
      <div className="text-gray-400 break-words text-xs">{hash}</div>
      <div className="flex flex-row items-center grow justify-end">
        {getSwitch()}
        {getState()}
        {getModal()}
      </div>
    </div>
  );
}
