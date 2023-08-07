import { Switch } from '@headlessui/react';
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
    });
  };

  const toggleAll = () => {
    setSearchParams({
      ...searchParams,
      all: !all,
    });
  };

  if (!user || !user.isAdmin) {
    return null;
  }
  return (
    <div className="flex flex-col p-3">
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
        <div className="font-semibold">
          Show deleted
        </div>
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
        <div className="font-semibold">
          Show all
        </div>
      </div>
    </div>
  );
}

export default function SearchBar() {
  const { searchParams, setSearchParams } = useDatasets();

  return (
    <div className="py-5 border border-gray-400 rounded flex flex-row">
      <div>
        <pre>
          {JSON.stringify(searchParams, null, 2)}
        </pre>
      </div>
      <div className="grow" />
      <AdminOptions />
    </div>
  );
}
