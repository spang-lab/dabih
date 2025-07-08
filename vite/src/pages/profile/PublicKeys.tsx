'use client';

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Plus } from 'react-feather';
import { Switch } from '@/util';

import { UserResponse } from '@/lib/api/types';
import DeleteDialog from '@/dialog/Delete';
import CreateKeyDialog from '@/dialog/CreateKey';
import { KeyRemoveBody } from '@/lib/api/types';
import PublicKey from './PublicKey';
import useSession from '@/Session';


export default function PublicKeys() {
  const { user, update, isAdmin } = useSession();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [rootOnly, setRootOnly] = useState<boolean>(false);
  const [toRemove, setToRemove] = useState<KeyRemoveBody | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);


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
    await update();
  };

  const removeKey = async (req: KeyRemoveBody) => {
    await api.user.removeKey(req);
    await fetchKeys();
  };
  const uploadKey = async (publicKey: JsonWebKey) => {
    if (!user) {
      return;
    }
    await api.user.addKey({
      sub: user.sub,
      data: { ...publicKey },
      isRootKey: true,
    });
    await fetchKeys();
    await update();
  };


  useEffect(() => {
    fetchKeys().catch(console.error);
  }, [fetchKeys]);



  return (
    <div className="py-2">
      <CreateKeyDialog
        show={showGenerate}
        onClose={() => setShowGenerate(false)}
        onSubmit={(k) => void uploadKey(k)} />
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
              isAdmin={isAdmin}
              onRemove={() => setToRemove({ sub: u.sub, hash: k.hash })}
              onEnable={(e: boolean) => void enableKey(u.sub, k.hash, e)}
            />
          )))
        )}
      </div>
      <div hidden={!isAdmin} className="m-2">
        <button
          className="px-2 py-1 bg-blue text-white rounded-lg disabled:opacity-50"
          type="button"
          onClick={() => setShowGenerate(true)}
        >
          <span className="whitespace-nowrap font-bold">
            <Plus className="inline-block mr-2 mb-1" size={18} />
            Generate a new root key
          </span>
        </button>
      </div>
    </div>
  );
}
