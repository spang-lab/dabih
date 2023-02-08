import React, { useEffect, useState, useCallback } from 'react';
import { Title3 } from '../util';
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

  const confirmKey = useCallback(async (keyId, confirmed) => {
    await api.confirmKey(keyId, confirmed);
    await getKeys();
  }, [api, getKeys]);

  const deleteKey = useCallback(async (keyId) => {
    await api.deleteKey(keyId);
    await getKeys();
  }, [api, getKeys]);

  useEffect(() => {
    getKeys();
  }, [getKeys]);

  return (
    <div>
      <Title3>Public Keys</Title3>
      {keys.map((k) => (
        <Key
          key={k.id}
          data={k}
          onConfirm={confirmKey}
          onDelete={deleteKey}
        />
      ))}
    </div>
  );
}
