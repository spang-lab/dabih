'use client';

import React from 'react';
import {
  Trash2, Terminal, Upload, Download,
} from 'react-feather';
import { LocalDate } from '@/components';
import { useProfile } from './Context';

export default function Token({ data }) {
  const { removeToken } = useProfile();
  const {
    token, timestamp, lifetime, scopes, id, isExpired,
  } = data;
  const exp = lifetime + new Date(timestamp).getTime();

  let type = 'API';
  if (scopes.includes('upload')) {
    type = 'Upload';
  }
  if (scopes.includes('download')) {
    type = 'Download';
  }

  const getIcon = () => {
    if (type === 'API') {
      return <Terminal size={24} />;
    }
    if (type === 'Download') {
      return <Download size={24} />;
    }
    return <Upload size={24} />;
  };
  const getExpired = () => {
    if (!isExpired) {
      return null;
    }
    return (
      <span className="text-red mx-1">
        Expired
      </span>
    );
  };

  return (
    <div className="flex items-center p-2 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="p-1 border shrink-0 text-blue justify-self-start border-blue rounded-md">
        {getIcon()}
      </div>
      <div>
        <div className="text-sm font-bold text-black">
          {type}
          {' '}
          Token
          {getExpired()}
        </div>
        <p className="text-xs">
          Expires:
          <LocalDate value={exp} />
        </p>
      </div>
      <div className="px-3 font-mono font-semibold grow whitespace-nowrap">
        {token}
      </div>
      <div className="justify-self-end">
        <button
          type="button"
          className="py-1 px-2 bg-red rounded-md text-white inline-flex items-center"
          onClick={() => removeToken(id)}
        >
          Delete
          <Trash2 className="ml-1" size={24} />
        </button>
      </div>
    </div>
  );
}
