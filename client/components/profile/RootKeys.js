'use client';

import React from 'react';
import { Key } from 'react-feather';
import { useProfile } from './Context';
import { LocalDate } from '../util';

function RootKey({ data }) {
  const {
    name, sub, email, hash, createdAt,
  } = data;
  return (
    <div className="flex flex-wrap items-center p-1 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="shrink-0 text-blue justify-self-start inline-flex items-center">
        <Key size={24} className="mr-2" />
        <span className="text-lg font-bold">
          Root key
        </span>
      </div>
      <div className="">
        <div className="font-medium">
          {name}
          <a className="text-blue px-2 font-bold" href={`mailto:${email}`}>
            {email}
          </a>
          <span className="text-gray-500 px-3">
            (id:
            {' '}
            {sub}
            )
          </span>
        </div>
      </div>
      <div className="text-gray-400 text-xs font-mono">
        Fingerprint:
        {' '}
        {hash}
      </div>
      <div className="text-gray-400">
        <LocalDate value={createdAt} />
      </div>
      <div className="grow" />
    </div>
  );
}

export default function Tokens() {
  const { publicKeys } = useProfile();
  const rootKeys = publicKeys.filter((k) => !!k.isRootKey);

  return (
    <div>
      <h3 className="text-lg font-extrabold tracking-tight sm:text-xl md:text-2xl">
        Root Keys
      </h3>
      <p className="text-gray-500">
        The owners of these keys are able to recover data.
      </p>
      {rootKeys.map((t) => (
        <RootKey data={t} key={t.id} />
      ))}
      <div hidden={rootKeys.length > 0} className="p-2 border italic text-gray-500 rounded-lg text-center">
        No root keys configured
      </div>
    </div>
  );
}
