import { Spinner } from "@/app/util";
import useFinder from "../Context";
import { jsx } from "react/jsx-runtime";

export default function SearchHeader() {

  const { search } = useFinder();
  if (search.status === "idle") {
    return null;
  }

  if (search.status === "loading") {
    return (
      <div className="flex flex-row border-b py-1 mb-3 text-gray-600">
        <span className="text-orange px-2 font-bold">
          Searching
        </span>
        {' '}
        for
        <span className="text-blue font-mono px-2">
          "{search.query}"
        </span>
        <Spinner small loading={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-row border-b py-1 mb-3 text-gray-600">
      <span className="text-orange px-2 font-bold">
        Showing results
      </span>
      {' '}
      for search
      <span className="text-blue font-mono px-2">
        "{search.query}"
      </span>
    </div>
  );
}
