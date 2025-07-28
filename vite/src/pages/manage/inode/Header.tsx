'use client';

import { Spinner } from "@/util";
import { X, Search, Folder } from "react-feather";
import { useState, useEffect } from "react";
import useFiles from "@/lib/hooks/files";


export default function Header() {
  const [query, setQuery] = useState<string>("");
  const parents = useFiles((state) => state.parents);

  const searchStatus = useFiles((state) => state.searchStatus);
  const searchQuery = useFiles((state) => state.query);
  const fetchResults = useFiles((state) => state.fetchResults);
  const search = useFiles((state) => state.search);
  const list = useFiles((state) => state.list);

  const inode = parents.at(0);
  useEffect(() => {
    if (searchStatus !== "loading") {
      return;
    }
    const interval = setInterval(() => {
      fetchResults().catch(console.error);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [searchStatus, fetchResults]);

  useEffect(() => {
    if (searchStatus === "complete") {
      setQuery("");
    }
  }, [searchStatus]);


  if (searchStatus === "idle" && inode) {
    return (
      <div className="flex flex-row border-b py-1 mb-3 text-gray-600 justify-between border-gray-200">
        <div
          className="flex rounded-sm flex-row px-3 text-xs font-bold text-blue items-center hover:bg-blue/10 cursor-pointer"
        >
          <Folder
            className="fill-blue/40 mr-1"
            size={26} strokeWidth={1} />
          {inode.name}
        </div>

        <div>
          <form onSubmit={(e) => {
            search(query).catch(console.error);
            e.preventDefault();
          }}>
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="border rounded-full px-2 py-1  border-gray-200"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  hidden={!query}
                  onClick={() => setQuery("")}
                  className="absolute text-gray-500 right-4"
                  type="reset">
                  <X size={24} />
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue text-white rounded-lg px-2 py-1 m-2 disabled:opacity-50"
                disabled={!query}
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>);
  }

  if (searchStatus === "loading") {
    return (
      <div className="flex flex-row border-b pt-2 mb-3 text-gray-600 justify-between border-gray-200">
        <div>
          <span className="text-orange px-2 font-bold">
            Searching
          </span>
          {' '}
          for
          <span className="text-blue font-mono px-2">
            "{searchQuery}"
          </span>
        </div>
        <Spinner small loading={true} />
        <div>
          <button
            className="px-2 border border-gray-600 rounded-sm inline-flex items-center"
            type="button"
            onClick={() => { list(null).catch(console.error); }}
          >
            <X />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row border-b pt-2 mb-3 text-gray-600 justify-between border-gray-200">
      <div>
        <span className="text-orange px-2 font-bold">
          Showing results
        </span>
        {' '}
        for search
        <span className="text-blue font-mono px-2">
          "{searchQuery}"
        </span>
      </div>
      <div>
        <button
          className="px-2 border border-gray-600 rounded-sm inline-flex items-center"
          type="button"
          onClick={() => { list(null).catch(console.error); }}
        >
          <X />
          Clear
        </button>
      </div>
    </div>
  );
}
