'use client';

import { useState } from "react";
import { Spinner } from "@/app/util";
import useSearch from "@/lib/hooks/search";
import { Search } from "react-feather";

export default function Test() {
  const [query, setQuery] = useState<string>("");
  const search = useSearch();

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        search.query(query).catch(console.error);
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
            disabled={!query || search.loading}
            className="bg-blue text-white rounded py-1 px-2 mx-2 disabled:opacity-40"
          >
            <Search />
          </button>
          <button
            type="button"
            className="bg-gray-600 text-white rounded py-1 px-2 m-2"
            onClick={() => {
              setQuery("");
              search.clear();
            }}
          >
            Clear
          </button>
        </div>
      </form>
      <Spinner small loading={search.loading} />
      <pre>{JSON.stringify(search.results, null, 2)}</pre>
    </div>
  );

}
