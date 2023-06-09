import React from 'react';
import {
  Container,
  Navigation,
  AdminApiWrapper,
  AdminInterface,
} from '../components';

export default function Admin() {
  return (
    <AdminApiWrapper>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-main-mid">
            {' '}
            Admin
            {' '}
          </span>
          Console
        </h1>
        <AdminInterface />
      </Container>
    </AdminApiWrapper>
  );
}
