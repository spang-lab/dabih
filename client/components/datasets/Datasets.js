'use client';

import React from 'react';

import Link from 'next/link';
import Dataset from './Dataset';
import SearchBar from './SearchBar';

import { DatasetsWrapper, useDatasets } from './Context';

export function DatasetList() {
  const { datasets, searchParams } = useDatasets();
  const { query } = searchParams;
  if (!datasets || !datasets.length) {
    if (query) {
      // return null;
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
  }
  return (
    <div>
      {datasets.map((dset) => (
        <Dataset key={dset.mnemonic} data={dset} />
      ))}
    </div>
  );
}

export default function Datasets() {
  return (
    <DatasetsWrapper>
      <SearchBar />
      <DatasetList />
    </DatasetsWrapper>
  );
}
