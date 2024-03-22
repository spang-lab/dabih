'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';
import crypto from '@/lib/crypto';
import { useKey, useUser } from '@/lib/hooks';
import api from '@/lib/api';
import useDialog from '../dialog';

const DatasetContext = createContext(null);

export function DatasetsWrapper({ children }) {
  const key = useKey();
  const user = useUser();
  const dialog = useDialog();
  const router = useRouter();

  const [datasets, setDatasets] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [datasetCount, setDatasetCount] = useState(0);
  const [searchParams, setSearchParams] = useState({
    deleted: false,
    all: false,
    page: 1,
    limit: 25,
  });

  const getAesKey = useCallback(async (mnemonic: string) => {
    if (!key) {
      return null;
    }
    const keyHash = await crypto.privateKey.toHash(key);
    const result = await api.dataset.key(mnemonic, keyHash);
    if (result.error) {
      dialog.error(result.error);
      return null;
    }
    const aesBuffer = await crypto.privateKey.decryptAesKey(key, result.key);
    return crypto.aesKey.fromUint8(aesBuffer);
  }, [dialog, key]);

  const fetchDatasets = useCallback(async () => {
    const data = await api.dataset.search(searchParams);
    if (data.error) {
      return;
    }
    setDatasets(data.datasets);
    setDatasetCount(data.count);
    if (user.isAdmin) {
      const orph = await api.dataset.listOrphans();
      setOrphans(orph);
    }
  }, [user.isAdmin, searchParams]);

  const removeDataset = useCallback(
    async (mnemonic: string) => {
      await api.dataset.remove(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );
  const destroyDataset = useCallback(
    async (mnemonic: string) => {
      await api.dataset.destroy(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );
  const recoverDataset = useCallback(
    async (mnemonic) => {
      await api.dataset.recover(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );

  const addMember = useCallback(
    async (mnemonic: string, member: string) => {
      const aesKey = await getAesKey(mnemonic);
      if (!aesKey) {
        return;
      }
      const base64 = await crypto.aesKey.toBase64(aesKey!);
      await api.dataset.addMember(mnemonic, member, base64);
      await fetchDatasets();
    },
    [getAesKey, fetchDatasets],
  );

  const reencryptDataset = useCallback(
    async (mnemonic: string) => {
      const aesKey = await getAesKey(mnemonic);
      if (!aesKey) {
        return;
      }
      const base64 = await crypto.aesKey.toBase64(aesKey);
      await api.dataset.reencrypt(mnemonic, base64);
    },
    [getAesKey],
  );

  const renameDataset = useCallback(
    async (mnemonic: string, name: string) => {
      await api.dataset.rename(mnemonic, name);
      await fetchDatasets();
    },
    [fetchDatasets],
  );

  const setAccess = useCallback(
    async (mnemonic: string, member: string, permission: string) => {
      await api.dataset.setAccess(mnemonic, member, permission);
      await fetchDatasets();
    },
    [fetchDatasets],
  );

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const contextValue = useMemo(
    () => ({
      datasets,
      orphans,
      datasetCount,
      searchParams,
      setSearchParams,
      removeDataset,
      destroyDataset,
      recoverDataset,
      reencryptDataset,
      renameDataset,
      addMember,
      setAccess,
    }),
    [
      datasets,
      orphans,
      searchParams,
      datasetCount,
      setSearchParams,
      removeDataset,
      recoverDataset,
      destroyDataset,
      renameDataset,
      reencryptDataset,
      addMember,
      setAccess,
    ],
  );

  return (
    <DatasetContext.Provider value={contextValue}>
      {children}
    </DatasetContext.Provider>
  );
}

export const useDatasets = () => useContext(DatasetContext);
