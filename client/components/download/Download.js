'use client';
import React from 'react';
import Link from 'next/link';

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
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Download Complete
        </h2>
        <p className="py-5">
          <a
            className="px-3 py-2 text-3xl text-white whitespace-nowrap button rounded-xl bg-blue hover:bg-blue"
            href={href}
          >
            Save File
            {' '}
            {file.name}
          </a>
        </p>

        <p>
          <Link className="text-blue hover:underline" href="/manage">
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
