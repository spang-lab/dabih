'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'react-feather';
import api from '@/lib/api';
import Token from './Token';

import { TokenAddBody, TokenResponse } from '@/lib/api/types';
import CreateTokenDialog from '@/dialog/CreateToken';
import ShowTokenDialog from '@/dialog/ShowToken';
import useSession from '@/Session';




export default function Tokens() {
  const { user, hasApi } = useSession();
  const [tokens, setTokens] = useState<TokenResponse[]>([]);
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [tokenValue, setTokenValue] = useState<string | null>(null);

  const scopes = user?.scope.split(' ') || [];


  const fetchTokens = useCallback(async () => {
    if (!hasApi) {
      return;
    }

    const { data, error } = await api.token.list();
    if (!data || error) {
      console.error(error);
      return;
    }
    setTokens(data);
  }, [hasApi]);

  const addToken = async (req: TokenAddBody) => {
    const { data: token, error } = await api.token.add(req);
    if (error) {
      console.error(error);
      return;
    }
    setTokenValue(token.value);
    await fetchTokens();
  }

  const removeToken = async (tokenId: string) => {
    await api.token.remove(tokenId);
    await fetchTokens();
  };

  useEffect(() => {
    fetchTokens().catch(console.error);
  }, [fetchTokens]);

  return (
    <div>
      <CreateTokenDialog
        show={showCreateToken}
        scopes={scopes}
        onClose={() => setShowCreateToken(false)}
        onSubmit={(r) => void addToken(r).catch(console.error)}
      />
      <ShowTokenDialog
        token={tokenValue}
        onClose={() => setTokenValue(null)}
      />

      {tokens.map((t) => (
        <Token data={t} key={t.value} onRemove={() => void removeToken(t.id as string)} />
      ))}
      <div hidden={tokens.length > 0} className="p-2 m-2 border italic text-gray-500 rounded-lg text-center border-gray-200">
        You have no access tokens.
      </div>
      <button
        className="m-1 rounded-sm text-white font-semibold bg-blue px-2 py-1 inline-flex items-center"
        type="button"
        onClick={() => setShowCreateToken(true)}
      >
        <Plus size={24} className="mr-1" />
        Generate an new Token
      </button>
    </div>
  );
}
