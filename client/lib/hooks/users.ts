'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import api from '../api';

export default function useUsers() {
  const [users, setUsers] = useState(null);
  const { status } = useSession();
  useEffect(() => {
    (async () => {
      if (status !== 'authenticated') {
        return;
      }
      const keyList = await api.key.list();
      if (keyList.error) {
        return;
      }
      setUsers(keyList.filter((k: any) => !k.isRootKey));
    })();
  }, [status]);
  return users;
}
