import React from 'react';

import {
  Container,
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
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Upload
          {' '}
          <span className="text-main-mid">your data</span>
        </h1>
        <Uploader />

      </Container>
    </div>
  );
}
