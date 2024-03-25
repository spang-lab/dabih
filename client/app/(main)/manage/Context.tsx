import useSession from '@/app/session';
import {
  createContext, useEffect, useCallback, useState, useMemo, useContext,
} from 'react';
import api from '@/lib/api';
import crypto from '@/lib/crypto';

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
type User = {
  sub: string,
  name: string,
  email: string,
};

type DatasetsContextType = {
  datasets: Dataset[],
  datasetCount: number,
  users: User[],
  searchParams: SearchParams,
  setSearchParams: (params: SearchParams) => void,
  addMember: (mnemonic: string, member: string) => Promise<void>,
  setAccess: (mnemonic: string, member: string, permission: string) => Promise<void>,
  rename: (mnemonic: string, name: string) => Promise<void>,
  remove: (mnemonic: string) => Promise<void>,
  recover: (mnemonic: string) => Promise<void>,
  destroy: (mnemonic: string) => Promise<void>,
  reencrypt: (mnemonic: string) => Promise<void>,
};

const DatasetsContext = createContext<DatasetsContextType | null>(null);

export function DatasetsWrapper({ children }) {
  const { key, status } = useSession();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [datasetCount, setDatasetCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
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
      return null;
    }
    const aesBuffer = await crypto.privateKey.decryptAesKey(key, result.key);
    const aesKey = await crypto.aesKey.fromUint8(aesBuffer);
    const base64 = await crypto.aesKey.toBase64(aesKey);
    return base64;
  }, [key]);

  const fetchDatasets = useCallback(async () => {
    const data = await api.dataset.search(searchParams);
    if (data.error) {
      return;
    }
    setDatasets(data.datasets);
    setDatasetCount(data.count);
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    const keys = await api.key.list();
    setUsers(keys.filter((k: any) => !k.isRootKey));
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    fetchDatasets();
    fetchUsers();
  }, [status, fetchDatasets, fetchUsers]);

  const value = useMemo(() => ({
    datasets,
    datasetCount,
    users,
    searchParams,
    setSearchParams,
    addMember: async (mnemonic: string, member: string) => {
      const aesKey = await getAesKey(mnemonic);
      if (!aesKey) {
        return;
      }
      await api.dataset.addMember(mnemonic, member, aesKey);
      await fetchDatasets();
    },
    setAccess: async (mnemonic: string, member: string, permission: string) => {
      await api.dataset.setAccess(mnemonic, member, permission);
      await fetchDatasets();
    },

    rename: async (mnemonic: string, name: string) => {
      await api.dataset.rename(mnemonic, name);
      await fetchDatasets();
    },
    remove: async (mnemonic: string) => {
      await api.dataset.remove(mnemonic);
      await fetchDatasets();
    },
    recover: async (mnemonic: string) => {
      await api.dataset.recover(mnemonic);
      await fetchDatasets();
    },
    destroy: async (mnemonic: string) => {
      await api.dataset.destroy(mnemonic);
      await fetchDatasets();
    },
    reencrypt: async (mnemonic: string) => {
      throw new Error(`unimplemented reencrypt ${mnemonic}`);
    },
  }), [
    datasets,
    users,
    datasetCount,
    searchParams,
    setSearchParams,
    fetchDatasets,
    getAesKey,
  ]);

  return (
    <DatasetsContext.Provider value={value}>
      {children}
    </DatasetsContext.Provider>
  );
}

const useDatasets = (): DatasetsContextType => {
  const ctx = useContext(DatasetsContext);
  if (!ctx) {
    throw new Error('Dataset Context is null');
  }
  return ctx;
};
export default useDatasets;
