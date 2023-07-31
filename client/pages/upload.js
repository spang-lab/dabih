import React from 'react';

import { Upload as Uploader } from '../components';

export default function Upload() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Upload
        {' '}
        <span className="text-blue">your data</span>
      </h1>
      <Uploader />
    </div>
  );
}
