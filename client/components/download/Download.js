import React from 'react';
import { Title2, Link } from '../util';

import { DownloadWrapper, useDownload } from './Context';
import Progress from './Progress';

export function DownloadMnemonic() {
  const { dataset, chunks, file } = useDownload();
  if (!dataset) {
    return null;
  }
  const oneMiB = 1024 * 1024;
  const chunkSize = 2 * oneMiB;

  if (file) {
    const href = URL.createObjectURL(file.data);
    return (
      <div className="w-1/2 py-20 mx-auto text-center">

        <Title2>Download Complete</Title2>
        <p className="py-5">

          <a
            className="px-3 py-2 text-3xl text-white whitespace-nowrap button rounded-xl bg-sky-700 hover:bg-sky-600"
            href={href}
          >
            Save File
            {' '}
            {file.name}
          </a>

        </p>

        <p>
          <Link href="/manage">
            Go Back
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Progress
        fileName={dataset.fileName}
        current={chunks.current * chunkSize}
        total={chunks.total * chunkSize}
      />
    </div>
  );
}

export default function Download() {
  return (
    <DownloadWrapper>
      <DownloadMnemonic />
    </DownloadWrapper>
  );
}
