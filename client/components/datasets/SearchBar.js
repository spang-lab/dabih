/* eslint-disable react-hooks/exhaustive-deps */
import { Switch } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useUser } from '../hooks';
import { useDatasets } from './Context';

function AdminOptions() {
  const { searchParams, setSearchParams } = useDatasets();
  const user = useUser();

  const { all, deleted } = searchParams;
  const toggleDeleted = () => {
    setSearchParams({
      ...searchParams,
      deleted: !deleted,
      page: 1,
    });
  };

  const toggleAll = () => {
    setSearchParams({
      ...searchParams,
      all: !all,
      page: 1,
    });
  };

  if (!user || !user.isAdmin) {
    return null;
  }
  return (
    <div className="flex flex-col px-3">
      <div className="inline-flex items-center pb-2">
        <Switch
          checked={deleted}
          onChange={toggleDeleted}
          className={`${deleted ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Show deleted</span>
          <span
            aria-hidden="true"
            className={`${deleted ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <div className="font-semibold">Show deleted</div>
      </div>
      <div className="inline-flex items-center">
        <Switch
          checked={all}
          onChange={toggleAll}
          className={`${all ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Show all</span>
          <span
            aria-hidden="true"
            className={`${all ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <div className="font-semibold">Show all</div>
      </div>
    </div>
  );
}

function PageButton({ value, active }) {
  const { searchParams, setSearchParams } = useDatasets();
  const setPage = () => setSearchParams({
    ...searchParams,
    page: value,
  });

  if (active) {
    return (
      <div className="text-white bg-blue border rounded mx-1 border-blue px-2 py-1">
        {value}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={setPage}
      className="text-blue border rounded mx-1 border-blue px-2 py-1"
    >
      {value}
    </button>
  );
}

function Pagination() {
  const { datasetCount, searchParams } = useDatasets();
  const { page, limit } = searchParams;
  const numPages = Math.ceil(datasetCount / limit);
  const pages = [...Array(numPages)].map((_, i) => i + 1);

  return (
    <div className="px-4 flex items-center">
      <span className="text-lg font-semibold">
        Page:
      </span>
      {pages.map((p) => <PageButton key={p} value={p} active={p === page} />)}
    </div>
  );
}

export default function SearchBar() {
  const { searchParams, setSearchParams } = useDatasets();

  const v = searchParams.query || '';
  const onChange = (e) => {
    const { value } = e.target;
    const query = value === '' ? null : value;
    setSearchParams({
      ...searchParams,
      query,
      page: 1,
    });
  };
  const onlyUploader = searchParams.uploader || false;
  const toggleUploader = () => {
    setSearchParams({
      ...searchParams,
      uploader: !onlyUploader,
      page: 1,
    });
  };

  return (
    <div className="py-5 border border-gray-400 rounded-md flex flex-row items-center">
      <div className="px-5">
        <input
          className="p-2 border border-gray-200 rounded-xl w-96"
          type="text"
          placeholder="Search..."
          value={v}
          onChange={onChange}
        />
      </div>
      <div className="inline-flex items-center">
        <Switch
          checked={onlyUploader}
          onChange={toggleUploader}
          className={`${onlyUploader ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Show all</span>
          <span
            aria-hidden="true"
            className={`${onlyUploader ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <div className="font-semibold">Show only my datasets</div>
      </div>
      <Pagination />
      <div className="grow" />
      <AdminOptions />
    </div>
  );
}
