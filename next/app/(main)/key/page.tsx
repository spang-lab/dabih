'use client';

import useSession from '@/app/session';
import Key from './Key';

export default function ManageKey() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold pb-4 tracking-tight sm:text-5xl md:text-6xl">
        Load your
        <span className="text-blue"> encryption key </span>
      </h1>
      <div className="text-base text-gray-400 sm:text-lg md:text-xl">
        <p>
          <span className="font-semibold text-blue"> Dabih </span>
          {' '}
          uses
          asymmetric key pairs for data encryption.
        </p>
        <p>Each key has two parts:</p>
        <ul className="px-4 leading-relaxed list-disc">
          <li>
            A public key, used to
            <span className="font-semibold text-blue"> encrypt </span>
            the data.
            <br />
            The public key will be sent to
            <span className="font-semibold text-blue"> Dabih </span>
            and will be stored there.
            <br />
            It is public information.
          </li>
          <li>
            A private key, used to
            <span className="font-semibold text-blue"> decrypt </span>
            the data.
            <br />
            The private key should
            <span className="font-semibold text-blue"> never </span>
            be shared and
            <span className="font-semibold text-blue"> only you </span>
            should have it.
          </li>
        </ul>
      </div>
      <Key />
    </div>
  );
}
