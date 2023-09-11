'use client';

import {
  ApiWrapper,
} from './Api';

export default function Providers({ children }) {
  return (
    <ApiWrapper>
      {children}
    </ApiWrapper>
  );
}
