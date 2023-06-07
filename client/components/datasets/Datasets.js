import React from 'react';

import Dataset from './Dataset';

import { DatasetsWrapper, useDatasets } from './Context';
import { Gray, Link } from '../util';

export function DatasetList() {
  const { datasets } = useDatasets();
  if (!datasets || !datasets.length) {
    return (
      <div className="py-10 text-center">
        <Gray>You have no datasets yet. Uploaded datasets will appear here</Gray>
        <p>
          <Link href="/upload">Go to the Upload page</Link>
        </p>
      </div>
    );
  }
  return (
    <div>
      {datasets.map((dset) => <Dataset key={dset.mnemonic} data={dset} />)}
    </div>
  );
}

export default function Datasets() {
  return (
    <DatasetsWrapper>
      <DatasetList />
    </DatasetsWrapper>
  );
}
