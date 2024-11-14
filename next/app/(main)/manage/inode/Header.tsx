'use client';

import { Spinner } from "@/app/util";
import useFinder from "../Context";
import { X, Search, Folder } from "react-feather";
import { useState, useEffect } from "react";


export default function Header() {
  const [query, setQuery] = useState<string>("");
  const { parents, search } = useFinder();
  const inode = parents.at(0);

  useEffect(() => {
    if (search.status === "complete") {
      setQuery("");
    }
  }, [search.status]);


  if (search.status === "idle" && inode) {
    return (
      <div className="flex flex-row border-b py-1 mb-3 text-gray-600 justify-between">
        <div
          className="flex rounded flex-row px-3 text-xs font-bold text-blue items-center hover:bg-blue/10 cursor-pointer"
        >
          <Folder
            className="fill-blue/40 mr-1"
            size={26} strokeWidth={1} />
          {inode.name}
        </div>

        <div>
          <form onSubmit={(e) => {
            search.search(query).catch(console.error);
            e.preventDefault();
          }}>
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="border rounded-full px-2 py-1 "
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

  if (search.status === "loading") {
    return (
      <div className="flex flex-row border-b pt-2 mb-3 text-gray-600 justify-between">
        <div>
          <span className="text-orange px-2 font-bold">
            Searching
          </span>
          {' '}
          for
          <span className="text-blue font-mono px-2">
            "{search.query}"
          </span>
        </div>
        <Spinner small loading={true} />
        <div>
          <button
            className="px-2 border border-gray-600 rounded inline-flex items-center"
            type="button"
            onClick={() => { search.clear().catch(console.error); }}
          >
            <X />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row border-b pt-2 mb-3 text-gray-600 justify-between">
      <div>
        <span className="text-orange px-2 font-bold">
          Showing results
        </span>
        {' '}
        for search
        <span className="text-blue font-mono px-2">
          "{search.query}"
        </span>
      </div>
      <div>
        <button
          className="px-2 border border-gray-600 rounded inline-flex items-center"
          type="button"
          onClick={() => { search.clear().catch(console.error); }}
        >
          <X />
          Clear
        </button>
      </div>
    </div>
  );
}
