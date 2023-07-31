import React from 'react';

import { Container, Navigation, Datasets } from '../components';

export default function Home() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Manage
          <span className="text-blue"> your data </span>
        </h1>
        <Datasets />
      </Container>
    </div>
  );
}
