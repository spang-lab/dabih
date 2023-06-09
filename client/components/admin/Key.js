import React from 'react';
import { Key } from 'react-feather';
import { Switch } from '@headlessui/react';
import { DeleteModal } from '../util';

const formatDate = (dbDate) => new Date(dbDate.replace(/ \+/, '+')).toLocaleString('de-DE');

export default function KeyElem({ data, onConfirm, onDelete }) {
  const {
    id, name, sub, hash, confirmed, confirmedBy, createdAt, isRootKey,
  } = data;
  const enabled = !!confirmed || isRootKey;
  const date = formatDate(createdAt);
  const toggle = async () => {
    if (isRootKey) {
      return;
    }
    await onConfirm(id, !confirmed);
  };

  const getSwitch = () => {
    if (isRootKey) {
      return '';
    }
    return (
      <Switch
        checked={enabled}
        onChange={toggle}
        className={`${enabled ? 'bg-main-mid' : 'bg-gray-mid'}
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
      <DeleteModal onDelete={() => onDelete(id)}>
        <p className="text-gray-mid">Are you sure you want to delete the key</p>
        <span className="font-semibold text-main-mid">
          {' '}
          {name}
          {' '}
        </span>
      </DeleteModal>
    );
  };

  return (
    <div className="flex items-center p-2 m-2 text-sm bg-white border border-gray-mid rounded-xl space-x-4">
      <div className="shrink-0 text-main-mid justify-self-start">
        <Key size={40} />
      </div>
      <div className="">
        <div className="font-medium text-black">{name}</div>
        <p>
          <span className="font-semibold text-main-mid">
            {' '}
            {sub}
            {' '}
          </span>
        </p>
        <p>
          <span className="text-gray-mid">{date}</span>
        </p>
        <p className="text-gray-mid">{hash}</p>
      </div>
      <div className="justify-self-end">{getModal()}</div>
      <div className="text-center justify-self-end">
        <p className="text-xs font-semibold text-gray-mid">Active</p>
        {getSwitch()}
        <p className="text-xs font-semibold text-gray-mid">{confirmedBy}</p>
      </div>
    </div>
  );
}
