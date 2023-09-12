'use client';

import { ReactNode } from 'react';

import {
  ApiWrapper,
} from './Api';

export default function Providers({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ApiWrapper>
      {children}
    </ApiWrapper>
  );
}
