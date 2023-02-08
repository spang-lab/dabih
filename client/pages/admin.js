import React from 'react';
import {
  Container,
  Title1,
  Navigation,
  Color,
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
        <Title1>
          <Color>
            Admin
          </Color>
          Console
        </Title1>
        <AdminInterface />
      </Container>
    </AdminApiWrapper>
  );
}
