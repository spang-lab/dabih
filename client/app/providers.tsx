'use client';

import { SessionProvider } from 'next-auth/react';

import {
  DialogWrapper, ApiWrapper,
} from '../components';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <DialogWrapper>
        <ApiWrapper>
          {children}
        </ApiWrapper>
      </DialogWrapper>
    </SessionProvider>
  );
}
