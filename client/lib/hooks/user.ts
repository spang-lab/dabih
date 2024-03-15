'use client';

import { useSession } from 'next-auth/react';

export default function useUser() {
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    return {
      status,
    };
  }
  const { user } = session;
  return {
    ...user,
    isAdmin: user?.scopes.includes('admin'),
    status,
  };
}
