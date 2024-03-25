import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import useKey from './key';
import crypto from '../crypto';

type Dataset = {
  mnemonic: string
};

type SearchParams = {
  query?: string,
  uploader?: boolean,
  deleted: boolean,
  all: boolean,
  page: number,
  limit: number,
  column?: string,
  direction?: string,
};

export default function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetCount, setDatasetCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    deleted: false,
    all: false,
    page: 1,
    limit: 25,
  });

  const { key } = useKey();
  const { status } = useSession();

  const getAesKey = async (mnemonic: string) => {
    if (!key) {
      return null;
    }
    const keyHash = await crypto.privateKey.toHash(key);
    const result = await api.dataset.key(mnemonic, keyHash);
    if (result.error) {
      return null;
    }
    const aesBuffer = await crypto.privateKey.decryptAesKey(key, result.key);
    const aesKey = await crypto.aesKey.fromUint8(aesBuffer);
    const base64 = await crypto.aesKey.toBase64(aesKey);
    return base64;
  };

  const fetchDatasets = useCallback(async () => {
    const data = await api.dataset.search(searchParams);
    if (data.error) {
      return;
    }
    setDatasets(data.datasets);
    setDatasetCount(data.count);
  }, [searchParams]);

  const addMember = async (mnemonic: string, member: string) => {
    const aesKey = await getAesKey(mnemonic);
    if (!aesKey) {
      return;
    }
    await api.dataset.addMember(mnemonic, member, aesKey);
    await fetchDatasets();
  };

  const setAccess = async (mnemonic: string, member: string, permission: string) => {
    await api.dataset.setAccess(mnemonic, member, permission);
    await fetchDatasets();
  };

  const rename = async (mnemonic: string, name: string) => {
    await api.dataset.rename(mnemonic, name);
    await fetchDatasets();
  };

  const remove = async (mnemonic: string) => {
    await api.dataset.remove(mnemonic);
    await fetchDatasets();
  };
  const recover = async (mnemonic: string) => {
    await api.dataset.recover(mnemonic);
    await fetchDatasets();
  };
  const destroy = async (mnemonic: string) => {
    await api.dataset.destroy(mnemonic);
    await fetchDatasets();
  };
  const reencrypt = async (mnemonic: string) => {
    throw new Error(`unimplemented reencrypt ${mnemonic}`);
  };

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    fetchDatasets();
  }, [status, fetchDatasets]);

  return {
    datasets,
    datasetCount,
    setSearchParams,
    searchParams,
    addMember,
    setAccess,
    rename,
    remove,
    recover,
    reencrypt,
    destroy,
  };
}
