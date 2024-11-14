'use client';

import { useCallback, useEffect, useState } from "react";
import { Search } from "react-feather";
import api from '@/lib/api';
import { InodeMembers } from "@/lib/api/types";
import { Spinner } from "@/app/util";

export default function Test() {
  const [query, setQuery] = useState<string>("");
  const [searchJob, setSearchJob] = useState<string | null>(null);
  const [results, setResults] = useState<InodeMembers[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const search = async () => {
    const { data } = await api.fs.searchStart({ query });
    if (!data) {
      return;
    }
    setResults([]);
    setLoading(true);
    setSearchJob(data.jobId);
  }

  const fetchResults = useCallback(async () => {
    const { data, error } = await api.fs.searchResults(searchJob!);
    if (!data || error) {
      setSearchJob(null);
      return;
    }
    if (data.isComplete) {
      setLoading(false);
      setSearchJob(null);
    }
    const newResults = data.inodes as InodeMembers[];
    setResults((prev) => [...prev, ...newResults]);
  }, [searchJob]);

  useEffect(() => {
    if (!searchJob) {
      return;
    }
    const interval = setInterval(() => {
      fetchResults().catch(console.error);
    }, 1000);

    return () => clearInterval(interval);
  }, [searchJob]);




  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        search().catch(console.error);
      }}>
        <div className="flex flex-row items-center">
          <input
            className="border border-gray-300 rounded p-1 m-2"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={!query || !!searchJob}
            className="bg-blue text-white rounded py-1 px-2 mx-2 disabled:opacity-40"
          >
            <Search />
          </button>
          <button
            type="button"
            className="bg-gray-600 text-white rounded py-1 px-2 m-2"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            Clear
          </button>
        </div>
      </form>
      <Spinner small loading={loading} />
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );

}
