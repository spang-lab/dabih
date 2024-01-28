'use client';

import React from 'react';
import { Trash2, Key } from 'react-feather';
import { Switch } from '@headlessui/react';
import { LocalDate } from '../../util';
import { useProfile } from '../Context';
import useDialog from '../../dialog';

export default function KeyElem({ data }) {
  const {
    id, name, sub, email, hash, confirmed, createdAt, isRootKey,
  } = data;
  const { confirmKey, deleteKey } = useProfile();
  const { openDialog } = useDialog();
  const enabled = !!confirmed || isRootKey;
  const toggle = async () => {
    if (isRootKey) {
      return;
    }
    await confirmKey(id, !confirmed);
  };

  const getState = () => {
    if (enabled) {
      return <div className="px-2 font-bold text-green">Active</div>;
    }
    return <div className="px-2 font-bold text-gray-500">disabled</div>;
  };

  const getSwitch = () => {
    if (isRootKey) {
      return (
        <div className="px-5 text-lg text-gray-500 mx-2 italic">
          Root key

        </div>
      );
    }
    return (
      <div className="flex flex-row items-center border-x px-3 mx-2">
        <Switch
          checked={enabled}
          onChange={toggle}
          className={`${enabled ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
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
      className="py-1 px-2 bg-red text-white rounded-md inline-flex items-center"
      onClick={() => openDialog('delete', {
        type: 'Public Key',
        name,
        onSubmit: () => deleteKey(id),
      })}
    >
      <Trash2 size={24} className="pr-2" />
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
          <a className="text-blue px-2 font-bold" href={`mailto:${email}`}>
            {email}
          </a>
          <span className="text-gray-500 px-3">
            (id:
            {' '}
            {sub}
            )
          </span>
        </div>
      </div>
      <div className="px-3 text-gray-500 font-light">
        <LocalDate value={createdAt} />
      </div>
      <div className="text-gray-400 text-xs">{hash}</div>
      <div className="grow" />
      <div className="justify-self-end flex flex-row items-center">
        {getSwitch()}
      </div>
      <div className="justify-self-end">{getModal()}</div>
    </div>
  );
}
