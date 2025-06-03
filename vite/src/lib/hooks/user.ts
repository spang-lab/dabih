import { create } from "zustand";
import type { User } from "../api/types";
import api from "../api";

export type UserStatus = "loading" | "unauthenticated" | "authenticated";

export interface State {
  user: User | null;
  status: UserStatus;
}

interface Actions {
  fetchUser: () => Promise<State>;
}

const useUser = create<State & Actions>((set, get) => ({
  user: null,
  status: "loading",
  fetchUser: async () => {
    const { data, error } = await api.auth.info();
    if (error || !data) {
      set({ user: null, status: "unauthenticated" });
      return get();
    }
    set({ user: data, status: "authenticated" });
    return get();
  },
}));
export default useUser;
