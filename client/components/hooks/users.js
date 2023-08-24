'use client';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../api';

export default function useUsers() {
  const api = useApi();
  const [users, setUsers] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const userList = await api.listKeyUsers();
    if (userList.error) {
      return;
    }
    setUsers(userList);
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return { users, fetchUsers };
}
