'use client';

import Link from 'next/link';
import useDatasets from './Context';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import Dataset from './Dataset';

export default function Manage() {
  const { datasets, datasetCount } = useDatasets();

  const getMessage = () => {
    if (datasetCount > 0) {
      return null;
    }
    return (
      <div className="py-10 text-center">
        <span className="text-gray-600">
          You have no datasets yet. Uploaded datasets will appear here
        </span>
        <p>
          <Link className="text-blue hover:underline" href="/upload">
            Go to the Upload page
          </Link>
        </p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Manage
        <span className="text-blue"> your data </span>
      </h1>
      <div>
        <SearchBar />
        <Pagination />
        {getMessage()}
        {datasets.map((dataset) => (
          <Dataset key={dataset.mnemonic} data={dataset} />
        ))}
        <Pagination />
      </div>
    </div>
  );
}
