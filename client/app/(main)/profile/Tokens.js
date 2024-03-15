'use client';

import React from 'react';
import { Plus } from 'react-feather';
import { useDialog } from '@/components';
import TokenModal from './TokenModal';
import Token from './Token';
import { useProfile } from './Context';

export default function Tokens() {
  const { tokens } = useProfile();
  const { openDialog } = useDialog();

  const createToken = async () => {
    openDialog('create_token', {
      onSubmit: () => {},
    });
  };

  return (
    <div>
      {tokens.map((t) => (
        <Token data={t} key={t.token} />
      ))}
      <div hidden={tokens.length > 0} className="p-2 m-2 border italic text-gray-500 rounded-lg text-center">
        You have no access tokens.
      </div>
      <button
        className="m-1 rounded text-white font-semibold bg-blue px-2 py-1 inline-flex items-center"
        type="button"
        onClick={() => createToken()}
      >
        <Plus size={24} className="mr-1" />
        Generate an new Token
      </button>
      <TokenModal />
    </div>
  );
}
