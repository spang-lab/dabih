import { create } from "zustand";

import { InodeMembers } from "@/lib/api/types";
import api from "@/lib/api";

interface State {
  nodes: InodeMembers[];
  parents: InodeMembers[];
  cwd: string | null;
  query?: string;
  jobId?: string;
  searchStatus: "idle" | "loading" | "complete" | "error";
}

interface Actions {
  list: (mnemonic: string | null) => Promise<void>;
  search: (query: string) => Promise<void>;
  shared: () => Promise<void>;
  fetchResults: () => Promise<void>;
}

const useFiles = create<State & Actions>((set, get) => ({
  nodes: [],
  parents: [],
  cwd: null,
  searchStatus: "idle",
  async list(mnemonic) {
    const state = get();
    if (state.searchStatus === "loading" && state.jobId) {
      await api.fs.searchCancel(state.jobId);
    }

    const { data, error } = await api.fs.list(mnemonic);
    if (!data || error) {
      return;
    }
    set({
      nodes: data.children,
      parents: data.parents,
      cwd: data.parents[0]?.mnemonic,
      query: undefined,
      jobId: undefined,
      searchStatus: "idle",
    });
  },
  async search(query) {
    const { data } = await api.fs.searchStart({ query });
    if (!data) {
      return;
    }
    set({
      query,
      jobId: data.jobId,
      nodes: [],
      parents: [],
      cwd: null,
      searchStatus: "loading",
    });
  },
  async shared() {
    const { data } = await api.fs.listShared();
    if (!data) {
      return;
    }
    set({
      nodes: data.children,
      parents: data.parents,
      cwd: null,
      query: undefined,
      jobId: undefined,
      searchStatus: "idle",
    });
  },
  async fetchResults() {
    const state = get();
    if (!state.jobId || state.searchStatus !== "loading") {
      return;
    }
    const { data, error } = await api.fs.searchResults(state.jobId);
    if (!data || error) {
      console.error(error || "No data");
      set({ searchStatus: "error" });
      return;
    }
    if (data.isComplete) {
      set({ searchStatus: "complete" });
    }
    const newResults = data.inodes as InodeMembers[];
    set((state) => ({
      nodes: [...state.nodes, ...newResults],
    }));
  },
}));

export default useFiles;
