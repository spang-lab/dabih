'use client';

import { useProfile } from '../Context';
import Key from './Key';
import RootKey from './RootKey';

export default function PublicKeys() {
  const { publicKeys } = useProfile();
  return (
    <div className="py-2">
      <h3 className="text-lg font-extrabold tracking-tight sm:text-xl md:text-2xl">
        Public Keys
      </h3>
      <div className="max-h-80 overflow-scroll">
        {publicKeys.map((k) => (
          <Key key={k.id} data={k} />
        ))}
      </div>
      <RootKey />
    </div>
  );
}
