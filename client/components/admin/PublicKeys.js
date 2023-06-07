import React, { useEffect, useState, useCallback } from 'react';
import { useAdminApi } from '../api';
import Key from './Key';

export default function PublicKeys() {
  const api = useAdminApi();
  const [keys, setKeys] = useState([]);

  const getKeys = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const data = await api.listKeys();
    if (data.error) {
      return;
    }
    setKeys(data);
  }, [api]);

  const confirmKey = useCallback(
    async (keyId, confirmed) => {
      await api.confirmKey(keyId, confirmed);
      await getKeys();
    },
    [api, getKeys],
  );

  const deleteKey = useCallback(
    async (keyId) => {
      await api.deleteKey(keyId);
      await getKeys();
    },
    [api, getKeys],
  );

  useEffect(() => {
    getKeys();
  }, [getKeys]);

  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Public Keys
      </h3>
      {keys.map((k) => (
        <Key key={k.id} data={k} onConfirm={confirmKey} onDelete={deleteKey} />
      ))}
    </div>
  );
}
