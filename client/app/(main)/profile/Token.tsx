'use client';

import React from 'react';
import {
  Trash2, Terminal,
} from 'react-feather';
import { LocalDate } from '@/app/util';

export default function Token({ data, onRemove }) {
  const {
    value, exp, isExpired, scopes,
  } = data;

  const getExpired = () => {
    if (!exp) {
      return 'never';
    }
    if (isExpired) {
      return (
        <span className="bg-red rounded-full px-2 py-1 text-white font-bold">
          Expired
        </span>
      );
    }
    return (
      <span className="text-sm">
        <LocalDate value={exp} />
      </span>

    );
  };

  return (
    <div className="flex flex-wrap items-center p-2 m-2 bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="inline-flex items-center text-blue font-extrabold text-xl">
        <Terminal className="text-blue mx-3" size={34} />
        API Token
      </div>
      <div className="px-3 font-mono font-semibold grow whitespace-nowrap">
        {value}
      </div>
      <div>
        Expires:
        {' '}
        {getExpired()}
      </div>
      <div>
        Scopes:
        {scopes.map((s) => (
          <span
            key={s}
            className="border text-sm font-mono rounded-full px-2 py-1 mx-1"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="grow flex justify-end">
        <button
          type="button"
          className="py-1 px-2 bg-red rounded-md text-white inline-flex items-center"
          onClick={onRemove}
        >
          Delete
          <Trash2 className="ml-1" size={24} />
        </button>
      </div>
    </div>
  );
}
