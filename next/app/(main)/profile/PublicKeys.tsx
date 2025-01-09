'use client';

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Plus } from 'react-feather';
import { Switch } from '@/app/util';

import { UserResponse } from '@/lib/api/types';
import DeleteDialog from '@/app/dialog/Delete';
import { KeyRemoveBody } from '@/lib/api/types';
import PublicKey from './PublicKey';
import { User } from 'next-auth';


export default function PublicKeys({ user }: { user: User }) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [rootOnly, setRootOnly] = useState<boolean>(false);
  const [toRemove, setToRemove] = useState<KeyRemoveBody | null>(null);


  const fetchKeys = useCallback(async () => {
    const { data, error } = await api.user.list();
    if (error) {
      return;
    }
    setUsers(data);
  }, []);

  const enableKey = async (sub: string, hash: string, enabled: boolean) => {
    await api.user.enableKey({
      sub,
      hash,
      enabled,
    });
    await fetchKeys();
  };

  const removeKey = async (req: KeyRemoveBody) => {
    await api.user.removeKey(req);
    await fetchKeys();
  };

  const createKey = () => {
    throw new Error('Not implemented');
    // dialog.openDialog('generate', {
    //   shake: true,
    //   onSubmit: async (key: JsonWebKey) => {
    //     if (status !== 'authenticated' || !user) {
    //       return;
    //     }
    //     const { sub } = user;
    //     await api.user.addKey({
    //       sub,
    //       data: { ...key },
    //       isRootKey: true,
    //     });
    //     await fetchKeys();
    //   },
    // });
  };

  const getButton = () => {
    if (!user.isAdmin) {
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
    fetchKeys().catch(console.error);
  }, [fetchKeys]);



  return (
    <div className="py-2">
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <DeleteDialog
        type="public key"
        name={toRemove?.hash ?? ''}
        show={!!toRemove}
        onSubmit={() => void removeKey(toRemove!)}
        onClose={() => setToRemove(null)}
      />
      <div className="inline-flex items-center">
        <Switch enabled={rootOnly} onChange={() => setRootOnly(!rootOnly)} />
        <span className="px-2 font-bold">
          Show only root keys
        </span>
      </div>
      <div className="max-h-96 overflow-scroll">
        {users.flatMap((u) => (
          u.keys.map((k) => (
            <PublicKey
              key={k.hash}
              publicKey={k}
              user={u}
              show={!rootOnly || k.isRootKey}
              isAdmin={user.isAdmin}
              onRemove={() => setToRemove({ sub: u.sub, hash: k.hash })}
              onEnable={(e: boolean) => void enableKey(u.sub, k.hash, e)}
            />
          )))
        )}
      </div>
      {getButton()}
    </div>
  );
}
