'use client';
import { useSession } from 'next-auth/react';

export default function useUser() {
  const { data: session } = useSession();
  if (!session) {
    return session;
  }
  const { user } = session;
  if (!user) {
    return null;
  }
  const { scopes } = user;
  user.isAdmin = scopes.includes('admin');
  return user;
}
