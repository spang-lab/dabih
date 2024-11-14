import { useState, useEffect, useCallback } from "react";
import { InodeMembers } from "../api/types";
import api from "../api";

interface SearchState {
  query?: string;
  jobId?: string;
  status: "idle" | "loading" | "complete" | "error";
}

export default function useSearch() {
  const [state, setState] = useState<SearchState>({
    status: "idle",
  });
  const [results, setResults] = useState<InodeMembers[]>([]);

  const search = async (query: string) => {
    const { data } = await api.fs.searchStart({ query });
    if (!data) {
      return;
    }
    setState({
      query,
      jobId: data.jobId,
      status: "loading",
    });
    setResults([]);
  };

  const clear = async () => {
    if (state.status === "loading" && state.jobId) {
      await api.fs.searchCancel(state.jobId);
    }

    setState({ status: "idle" });
    setResults([]);
  };

  const fetchResults = useCallback(async () => {
    if (!state.jobId) {
      return;
    }
    const { data, error } = await api.fs.searchResults(state.jobId);
    if (!data || error) {
      console.error(error || "No data");
      setState({ status: "error" });
      return;
    }
    if (data.isComplete) {
      setState({ query: state.query, status: "complete" });
    }
    const newResults = data.inodes as InodeMembers[];
    setResults((prev) => [...prev, ...newResults]);
  }, [state]);

  useEffect(() => {
    if (!state.jobId) {
      return;
    }
    const interval = setInterval(() => {
      fetchResults().catch(console.error);
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  return {
    search,
    clear,
    results,
    ...state,
    isActive: state.status !== "idle",
  };
}
