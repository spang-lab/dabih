'use client';

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Plus } from 'react-feather';
import { Switch } from '@/app/util';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';
import PublicKey from './PublicKey';
import { UserResponse } from '@/lib/api/types';

export default function PublicKeys() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [rootOnly, setRootOnly] = useState<boolean>(false);
  const dialog = useDialog();

  const {
    user, status, isAdmin, update,
  } = useSession();

  const fetchKeys = useCallback(async () => {
    const { data, error } = await api.user.list();
    if (error) {
      return;
    }
    setUsers(data);
  }, []);

  const enableKey = async (hash: string, enabled: boolean) => {
    if (!user) {
      return;
    }
    await api.user.enableKey({
      sub: user.sub,
      hash,
      enabled,
    });
    await fetchKeys();
  };

  const removeKey = async (hash: string) => {
    if (!user) {
      return;
    }
    await api.user.removeKey({
      sub: user.sub,
      hash,
    });
    await fetchKeys();
    update();
  };

  const createKey = () => {
    dialog.openDialog('generate', {
      shake: true,
      onSubmit: async (key: JsonWebKey) => {
        if (status !== 'authenticated' || !user) {
          return;
        }
        const { sub } = user;
        await api.user.addKey({
          sub,
          data: { ...key },
          isRootKey: true,
        });
        await fetchKeys();
      },
    });
  };

  const getButton = () => {
    if (isAdmin) {
      return null;
    }
    return (
      <div className="m-2">
        <button
          className="px-2 py-1 bg-blue text-white rounded-lg"
          type="button"
          onClick={createKey}
        >
          <span className="whitespace-nowrap font-bold">
            <Plus className="inline-block mr-2 mb-1" size={18} />
            Generate a new root key
          </span>
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    fetchKeys().catch(console.error);
  }, [status, fetchKeys]);

  const publicKeys = users.flatMap((u) => u.keys)
    .filter((k) => !rootOnly || k.isRootKey);

  return (
    <div className="py-2">
      <div className="inline-flex items-center">
        <Switch enabled={rootOnly} onChange={() => setRootOnly(!rootOnly)} />
        <span className="px-2 font-bold">
          Show only root keys
        </span>
      </div>
      <div className="max-h-96 overflow-scroll">
        {publicKeys
          .map((k) => (
            <PublicKey
              key={k.hash}
              data={k}
              onRemove={() => removeKey(k.hash)}
              onEnable={(e: boolean) => enableKey(k.hash, e)}
            />
          ))}
      </div>
      {getButton()}
    </div>
  );
}
