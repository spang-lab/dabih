import React from 'react';

import {
  Container,
  Title1,
  Title2,
  Navigation,
  Datasets,
  Color,
  Tokens,
} from '../components';

export default function Home() {
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <Title1>
          Manage
          <Color>your data</Color>
        </Title1>
        <Datasets />
        <Title2>
          Access
          <Color>tokens</Color>
        </Title2>
        <Tokens />
      </Container>
    </div>
  );
}
