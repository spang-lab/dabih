import React from 'react';

import {
  Navigation,
  Container,
  Key,
} from '../components';

export default function ManageKey() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Load your
          <span className="text-main-200">
            {' '}
            encryption key
            {' '}
          </span>
        </h1>
        <div className="text-base text-gray-400 sm:text-lg md:text-xl">
          <p>
            <span className="font-semibold text-main-200">
              {' '}
              Dabih
              {' '}
            </span>
            {' '}
            uses asymmetric key pairs for data encryption.
          </p>
          <p>
            Each key has two parts:
          </p>
          <ul className="px-4 leading-relaxed list-disc">
            <li>
              A public key, used to
              <span className="font-semibold text-main-200">
                {' '}
                encrypt
                {' '}
              </span>
              the data.
              <br />
              The public key will be sent to
              <span className="font-semibold text-main-200">
                {' '}
                Dabih
                {' '}
              </span>
              and will be stored there.
              <br />
              It is public information.
            </li>
            <li>
              A private key, used to
              <span className="font-semibold text-main-200">
                {' '}
                decrypt
                {' '}
              </span>
              the data.
              <br />
              The private key should
              <span className="font-semibold text-main-200">
                {' '}
                never
                {' '}
              </span>
              be shared and
              <span className="font-semibold text-main-200">
                {' '}
                only you
                {' '}
              </span>
              should have it.
            </li>

          </ul>

        </div>
        <Key />
      </Container>
    </div>
  );
}
