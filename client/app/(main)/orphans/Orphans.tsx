'use client';

import { Disclosure } from '@headlessui/react';

import { useCallback, useState, useEffect } from 'react';
import { ChevronRight } from 'react-feather';
import api from '@/lib/api';
import useSession from '@/app/session';
import Orphan from './Orphan';

export default function Orphans() {
  const { isAdmin } = useSession();
  const [orphans, setOrphans] = useState<any[]>([]);

  const fetchOrphans = useCallback(async () => {
    const data = await api.dataset.listOrphans();
    setOrphans(data);
  }, []);

  const removeOrphan = async (mnemonic: string) => {
    await api.dataset.remove(mnemonic);
    await fetchOrphans();
  };
  const destroyOrphan = async (mnemonic: string) => {
    await api.dataset.destroy(mnemonic);
    await fetchOrphans();
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    fetchOrphans();
  }, [isAdmin, fetchOrphans]);

  const count = orphans.length;
  if (count === 0) {
    return null;
  }
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center bg-red/40 text-lg text-red font-bold w-full my-2 p-2 rounded-md">
            <div className="px-2">
              <ChevronRight className={(open) ? 'rotate-90' : ''} size={30} />
            </div>
            <div className="px-3">
              {count}
              {' '}
              orphaned datasets
            </div>
            <div className="text-gray-800 font-light text-sm">
              Orphaned datasets are datasets with no valid members.
              They can only be recovered using a
              {' '}
              <span className="text-blue">root key</span>
              .
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="text-gray-500">
            {orphans.map((o) => (
              <Orphan
                data={o}
                key={o.mnemonic}
                onRemove={() => removeOrphan(o.mnemonic)}
                onDestroy={() => destroyOrphan(o.mnemonic)}
              />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
