'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'react-feather';
import api from '@/lib/api';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';
import Token from './Token';

export default function Tokens() {
  const [tokens, setTokens] = useState<any[]>([]);
  const dialog = useDialog();
  const { status } = useSession();

  const fetchTokens = useCallback(async () => {
    const result = await api.token.list();
    if (!result || result.error) {
      return;
    }
    setTokens(result);
  }, []);

  const createToken = async () => {
    dialog.openDialog('create_token', {
      onSubmit: async (scopes: string[], lifetime: number | null) => {
        const token = await api.token.add(scopes, lifetime);
        if (token.error) {
          dialog.error(token.error);
          return;
        }
        dialog.openDialog('show_token', {
          shake: true,
          token,
          onSubmit: () => {
            fetchTokens();
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
    fetchTokens();
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
