import React from 'react';
import { Trash2, Key } from 'react-feather';
import { Switch } from '@headlessui/react';
import { LocalDate } from '../../util';
import { useProfile } from '../Context';
import useDialog from '../../dialog';

export default function KeyElem({ data }) {
  const {
    id, name, sub, hash, confirmed, confirmedBy, createdAt, isRootKey,
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

  const getSwitch = () => {
    if (isRootKey) {
      return '';
    }
    return (
      <Switch
        checked={enabled}
        onChange={toggle}
        className={`${enabled ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Key enabled</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    );
  };

  const getModal = () => {
    if (isRootKey) {
      return '';
    }
    return (
      <button
        type="button"
        className="pt-1 px-2 bg-red text-white rounded-md"
        onClick={() => openDialog('delete', {
          type: 'Public Key',
          name,
          onSubmit: () => deleteKey(id),
        })}
      >
        <Trash2 size={24} className="flex justify-self-center" />
        <div className="text-[10px] font-bold">
          Delete
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-center p-2 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="shrink-0 text-blue justify-self-start">
        <Key size={40} />
      </div>
      <div className="">
        <div className="font-medium text-black">{name}</div>
        <p>
          <span className="font-semibold text-blue">
            {' '}
            {sub}
            {' '}
          </span>
        </p>
        <p className="text-gray-400 font-light">
          <LocalDate value={createdAt} />
        </p>
        <p className="text-gray-400">{hash}</p>
      </div>
      <div className="justify-self-end">{getModal()}</div>
      <div className="text-center justify-self-end">
        <p className="text-xs font-semibold text-gray-400">Active</p>
        {getSwitch()}
        <p className="text-xs font-semibold text-gray-400">{confirmedBy}</p>
      </div>
    </div>
  );
}
