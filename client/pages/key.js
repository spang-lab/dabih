import React from 'react';

import {
  Navigation,
  Container,
  Key,
  Highlight,
  Color,
  Title1,
  Subtitle1,
} from '../components';

export default function ManageKey() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <Title1>
          Load your
          <Color>encryption key</Color>
        </Title1>
        <Subtitle1>
          <p>
            <Highlight>
              Dabih
            </Highlight>
            {' '}
            uses asymmetric key pairs for data encryption.
          </p>
          <p>
            Each key has two parts:
          </p>
          <ul className="px-4 leading-relaxed list-disc">
            <li>
              A public key, used to
              <Highlight>encrypt</Highlight>
              the data.
              <br />
              The public key will be sent to
              <Highlight>Dabih</Highlight>
              and will be stored there.
              <br />
              It is public information.
            </li>
            <li>
              A private key, used to
              <Highlight>decrypt</Highlight>
              the data.
              <br />
              The private key should
              <Highlight>never</Highlight>
              be shared and
              <Highlight>only you</Highlight>
              should have it.
            </li>

          </ul>

        </Subtitle1>
        <Key />
      </Container>
    </div>
  );
}
