import React from 'react';

import { signIn } from 'next-auth/react';

import {
  Container,
  BigButton,
  Title1,
  Subtitle1,
  Navigation,
  Highlight,
  Link,
} from '../components';

export default function Account() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <Title1>
          Sign in to
          {' '}
          <span className="text-sky-700">
            your account
          </span>

        </Title1>
        <Subtitle1>
          <Highlight>
            Dabih
          </Highlight>
          {' '}
          needs two factors from you to work:
          <ul className="px-4 leading-relaxed list-disc">
            <li>
              You need to be registered at your identiy provider
            </li>
            <li>
              You need to have your
              {' '}
              <Highlight>
                Private Key
              </Highlight>
            </li>
            <li>
              We do
              {' '}
              <Highlight>not</Highlight>
              {' '}
              store your personal data.
            </li>
            <li>
              The identiy provider gives
              {' '}
              <Highlight>
                Dabih
              </Highlight>
              {' '}
              a personalized access token.
            </li>
            <li>
              The access token will be used to verify you are
              authorized to use this service.
            </li>

          </ul>
        </Subtitle1>
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
