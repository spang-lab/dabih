import React from 'react';

import {
  Container,
  Title1,
  Navigation,
  Upload as Uploader,
} from '../components';

export default function Upload() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <Title1>
          Upload
          {' '}
          <span className="text-sky-700">your data</span>
        </Title1>
        <Uploader />

      </Container>
    </div>
  );
}
