'use client';


import {
  SessionWrapper,
} from './session';

export default function Providers({ children }) {
  return (
    <SessionWrapper>
      {children}
    </SessionWrapper>
  );
}
