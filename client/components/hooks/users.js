import {useEffect, useState} from 'react';
import {useApi} from '../api';

export default function useUsers() {
  const api = useApi();
  const [users, setUsers] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!api.isReady()) {
        return;
      }
      const userList = await api.listKeyUsers();
      setUsers(userList);
    };
    fetchUsers();
  }, [api]);
  return users;
}
