'use client';

import { Disclosure } from '@headlessui/react';

import { useState, useCallback, useEffect } from 'react';
import { ChevronRight } from 'react-feather';
import { useApi } from '../api';
import { useDatasets } from './Context';
import Orphan from './Orphan';

export default function Orphans() {
  const { orphans } = useDatasets();

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
            {orphans.map((o) => <Orphan data={o} key={o.mnemonic} />)}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
