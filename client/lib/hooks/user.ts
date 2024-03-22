'use client';

import { useSession } from 'next-auth/react';

export default function useUser() {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return {
      scopes: [],
      isAdmin: false,
      status,
    };
  }
  const { user, expires } = session;
  return {
    ...user,
    expires,
    isAdmin: user?.scopes.includes('admin'),
    status,
  };
}
