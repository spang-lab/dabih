import { useEffect, useState } from "react";
import api from "@/lib/api";
import { UserResponse } from "@/lib/api/types";

export default function useUsers() {
  const [users, setUsers] = useState<UserResponse[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.user.list();
      if (!data) {
        return;
      }
      setUsers(data);
    })().catch(console.error);
  }, []);

  if (!users) {
    return null;
  }
  const userIndex: Record<string, UserResponse> = users.reduce((acc, user) => {
    acc[user.sub] = user;
    return acc;
  }, {});
  return userIndex;
}
