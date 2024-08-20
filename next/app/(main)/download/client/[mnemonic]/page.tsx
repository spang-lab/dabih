'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import useDownload from '@/lib/hooks/download';
import Progress from './Progress';

export default function Download() {
  const { mnemonic } = useParams<{ mnemonic: string }>();
  const download = useDownload();

  useEffect(() => {
    if (download.state === 'ready') {
      download.start(mnemonic);
    }
  }, [download, mnemonic]);

  if (download.state === 'error') {
    return (
      <div className="text-center border border-red rounded-xl p-3">
        <h1 className="text-3xl text-red">
          Unexpected Error
        </h1>
        <div className="font-mono text-gray-800 px-10">
          {download.error!}
        </div>
        <div className="p-3">
          <Link
            className="text-xl font-bold text-blue hover:underline"
            href="/manage"
          >
            Go back
          </Link>
        </div>
      </div>
    );
  }

  if (download.state === 'complete') {
    const { file, fileName } = download;
    const href = URL.createObjectURL(file!);
    return (
      <div className="w-1/2 py-20 mx-auto text-center">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Download Complete
        </h2>
        <p className="py-5">
          <a
            className="px-3 py-2 text-3xl text-white whitespace-nowrap button rounded-xl bg-blue hover:bg-blue"
            download={fileName}
            href={href}
          >
            Save File
            {' '}
            {fileName}
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

  if (download.state === 'downloading') {
    const { current, total, fileName } = download;
    return (
      <div>
        <Progress
          fileName={fileName}
          current={current}
          total={total}
        />
      </div>
    );
  }
  return null;
}
