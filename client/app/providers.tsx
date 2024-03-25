'use client';

import {
  DialogWrapper,
} from './dialog/Context';

import {
  SessionWrapper,
} from './session';

export default function Providers({ children }) {
  return (
    <SessionWrapper>
      <DialogWrapper>
        {children}
      </DialogWrapper>
    </SessionWrapper>
  );
}
