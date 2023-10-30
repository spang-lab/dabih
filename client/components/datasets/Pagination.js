import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'react-feather';
import { useDatasets } from './Context';

function PageButton({ value, active }) {
  const { searchParams, setSearchParams } = useDatasets();
  const { idx, hidden } = value;
  const setPage = () => setSearchParams({
    ...searchParams,
    page: idx,
  });
  if (hidden) {
    return (
      <div className="p-2 font-extrabold">
        ·
        {' '}
        ·
        {' '}
        ·
      </div>
    );
  }

  if (active) {
    return (
      <div className="text-white bg-blue text-sm font-extrabold border rounded m-1 border-blue px-2 py-1">
        {idx}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={setPage}
      className="text-blue border text-sm rounded m-1 border-blue px-2 py-1 "
    >
      {idx}
    </button>
  );
}

export default function Pagination() {
  const { datasetCount, searchParams, setSearchParams } = useDatasets();
  const { page, limit } = searchParams;
  const numPages = Math.ceil(datasetCount / limit);
  const pages = [...Array(numPages)]
    .map((_, i) => i + 1)
    .map((p) => {
      if (p <= 3 || Math.abs(p - page) < 2 || numPages - p < 3) {
        return { idx: p };
      }
      return { idx: p, hidden: true };
    })
    .filter((p, i, arr) => {
      if (i === 0 || !p.hidden) {
        return true;
      }
      return !arr[i - 1].hidden;
    });

  const setPage = (p) => {
    const newPage = p;
    if (newPage <= 0 || newPage > numPages) {
      return;
    }
    setSearchParams({
      ...searchParams,
      page: newPage,
    });
  };

  return (
    <div className="px-4 flex justify-center">
      <div className="flex items-center w-full">
        <div className="flex w-32">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(1)}
            className="text-blue border text-sm rounded m-1 border-blue px-2 disabled:text-gray-400 disabled:border-gray-400 "
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="text-blue border text-sm rounded m-1 border-blue px-2 disabled:text-gray-400 disabled:border-gray-400 "
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex grow justify-center">

          {pages.map((p) => <PageButton key={p.idx} value={p} active={p.idx === page} />)}
        </div>
        <div className="flex w-32">
          <button
            type="button"
            disabled={page === numPages}
            onClick={() => setPage(page + 1)}
            className="text-blue border text-sm rounded m-1 border-blue px-2 disabled:text-gray-400 disabled:border-gray-400 "
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            disabled={page === numPages}
            onClick={() => setPage(numPages)}
            className="text-blue border text-sm rounded m-1 border-blue px-2 disabled:text-gray-400 disabled:border-gray-400 "
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
