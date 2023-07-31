import React from 'react';

import { signIn } from 'next-auth/react';

import {
  Container,
  BigButton,
  Navigation,
  Link,
} from '../components';

export default function Account() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Sign in to
          {' '}
          <span className="text-blue">
            your account
          </span>

        </h1>
        <div className="text-base text-gray-400 sm:text-lg md:text-xl">
          <span className="font-semibold text-blue">
            {' '}
            Dabih
            {' '}
          </span>
          {' '}
          needs two factors from you to work:
          <ul className="px-4 leading-relaxed list-disc">
            <li>
              You need to be registered at your identiy provider
            </li>
            <li>
              You need to have your
              {' '}
              <span className="font-semibold text-blue">
                {' '}
                Private Key
                {' '}
              </span>
            </li>
            <li>
              We do
              {' '}
              <span className="font-semibold text-blue">
                {' '}
                not
                {' '}
              </span>
              {' '}
              store your personal data.
            </li>
            <li>
              The identiy provider gives
              {' '}
              <span className="font-semibold text-blue">
                {' '}
                Dabih
                {' '}
              </span>
              {' '}
              a personalized access token.
            </li>
            <li>
              The access token will be used to verify you are
              authorized to use this service.
            </li>

          </ul>
        </div>
        <div className="mt-5">
          <BigButton
            onClick={() => signIn()}
          >
            Sign In
          </BigButton>
          <span className="pl-10">
            <Link className="text-xl" muted href="https://abc.de">
              Create a new account
            </Link>
          </span>
        </div>

      </Container>
    </div>
  );
}
