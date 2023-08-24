'use client';
import { useProfile } from '../Context';
import Key from './Key';

export default function PublicKeys() {
  const { publicKeys } = useProfile();
  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Public Keys
      </h3>
      {publicKeys.map((k) => (
        <Key key={k.id} data={k} />
      ))}
    </div>
  );
}
