'use client';

import React from 'react';
import { Plus } from 'react-feather';
import TokenModal from './TokenModal';
import Token from './Token';
import { useProfile } from './Context';

export default function Tokens() {
  const { tokens, generateToken } = useProfile();

  return (
    <div>
      {tokens.map((t) => (
        <Token data={t} key={t.token} />
      ))}
      <button
        className="m-1 text-sm rounded text-white font-semibold bg-blue px-2 py-1"
        type="button"
        onClick={() => generateToken('api')}
      >
        <Plus size={24} className="inline-block" />
        {' '}
        Generate an API Token
      </button>
      <button
        className="m-1 text-sm rounded text-white font-semibold bg-blue px-2 py-1"
        type="button"
        onClick={() => generateToken('upload')}
      >
        <Plus size={24} className="inline-block" />
        {' '}
        Generate an Upload Token
      </button>
      <TokenModal />
    </div>
  );
}
