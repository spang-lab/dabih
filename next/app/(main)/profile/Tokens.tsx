'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'react-feather';
import api from '@/lib/api';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';
import Token from './Token';

import { TokenResponse } from '@/lib/api/types';

export default function Tokens() {
  const [tokens, setTokens] = useState<TokenResponse[]>([]);
  const dialog = useDialog();
  const { status } = useSession();

  const fetchTokens = useCallback(async () => {
    const { data, error } = await api.token.list();
    if (!data || error) {
      console.error(error);
      return;
    }
    setTokens(data);
  }, []);

  const createToken = () => {
    dialog.openDialog('create_token', {
      onSubmit: async (scopes: string[], lifetime: number | null) => {
        const { data: token, error } = await api.token.add({
          scopes,
          lifetime,
        });
        if (error) {
          dialog.error(error);
          return;
        }
        dialog.openDialog('show_token', {
          shake: true,
          token,
          onSubmit: async () => {
            await fetchTokens();
          },
        });
      },
    });
  };
  const removeToken = async (tokenId: number) => {
    await api.token.remove(tokenId);
    await fetchTokens();
  };

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    fetchTokens().catch(console.error);
  }, [status, fetchTokens]);

  return (
    <div>
      {tokens.map((t) => (
        <Token data={t} key={t.value} onRemove={() => removeToken(t.id)} />
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
    </div>
  );
}
