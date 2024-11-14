'use client';

import { Spinner } from "@/app/util";
import useFinder from "../Context";
import { useState, useEffect } from "react";
import { Search, X } from "react-feather";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const { search } = useFinder();

  useEffect(() => {
    if (!query) {
      search.clear();
    }
  }, [query]);


  return (
    <div>
      <form onSubmit={(e) => {
        search.search(query).catch(console.error);
        e.preventDefault();
      }}>
        <div className="flex items-center">
          <div className="relative flex items-center">
            <input
              type="text"
              className="border text-lg rounded-full px-2 py-1 my-2"
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
            <div className="absolute right-10">
              <Spinner small loading={search.status === "loading"} />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue text-white rounded-lg px-2 py-1 m-2"
            disabled={!query}
          >
            <Search size={24} />
          </button>
        </div>
      </form>

    </div>
  );
}
