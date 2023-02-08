import React from 'react';
import { Key } from 'react-feather';
import { storage } from '../../lib';

export default function KeyStatus() {
  const key = storage.useKey();

  const onClick = () => {
    storage.deleteKey();
  };

  if (key) {
    return (
      <div className="inset-y-0 right-0 flex items-center pr-2 sm:inset-auto sm:ml-6 sm:pr-0">
        <button
          onClick={onClick}
          type="button"
          className="px-3 py-1 text-center rounded-lg text-emerald-500 bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <p className="text-xs font-semibold">
            Key loaded

          </p>
          <Key className="mx-auto" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="inset-y-0 right-0 flex items-center pr-2 sm:inset-auto sm:ml-6 sm:pr-0">
      <button
        type="button"
        className="px-5 py-2 rounded-full text-sky-500 bg-sky-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        No key
      </button>
    </div>
  );
}
