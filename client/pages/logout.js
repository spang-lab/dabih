import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react';

import { Container } from '../components';

export default function Logout() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);
  return (
    <Container>
      Log out
    </Container>
  );
}
