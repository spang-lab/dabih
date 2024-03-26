'use client';

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Plus } from 'react-feather';
import { Switch } from '@/app/util';
import useDialog from '@/app/dialog';
import useSession from '@/app/session';
import PublicKey from './PublicKey';

export default function PublicKeys() {
  const [publicKeys, setPublicKeys] = useState<any[]>([]);
  const [rootOnly, setRootOnly] = useState<boolean>(false);
  const dialog = useDialog();

  const {
    user, status, isAdmin, update,
  } = useSession();

  const fetchKeys = useCallback(async () => {
    const data = await api.key.list();
    if (data.error) {
      return;
    }

    setPublicKeys(data);
  }, []);

  const enableKey = async (id: number, enabled: boolean) => {
    await api.key.enable(id, enabled);
    await fetchKeys();
  };

  const removeKey = async (id: number) => {
    await api.key.remove(id);
    await fetchKeys();
    update();
  };

  const addKey = async (key: any) => {
    if (status !== 'authenticated' || !user) {
      return;
    }
    const { name, email } = user;
    const keyData = {
      key,
      isRootKey: true,
      name,
      email,
    };
    await api.key.add(keyData);
    await fetchKeys();
  };

  const createKey = async () => {
    dialog.openDialog('generate', {
      shake: true,
      onSubmit: (key: any) => {
        if (key.error) {
          dialog.error(key.error);
          return;
        }
        addKey(key);
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
    fetchKeys();
  }, [status, fetchKeys]);

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
          .filter((k) => !rootOnly || k.isRootKey)
          .map((k) => (
            <PublicKey
              key={k.id}
              data={k}
              onRemove={() => removeKey(k.id)}
              onEnable={(e: boolean) => enableKey(k.id, e)}
            />
          ))}
      </div>
      {getButton()}
    </div>
  );
}
