'use client';

import React from 'react';
import { Download } from 'react-feather';
import useDownload from '@/lib/hooks/download';
import { Bytes } from '@/app/util';

export default function DownloadButton({ mnemonic, enabled }) {
  const download = useDownload();

  if (!enabled) {
    return (
      <div>
        <button
          type="button"
          disabled
          className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue/40 flex-nowrap"
        >
          <Download className="inline-block mr-2" size={20} />
          Download
        </button>
      </div>
    );
  }
  if (download.state === 'error') {
    return (
      <div className="px-3 text-red">
        Unknown Error
      </div>
    );
  }

  if (download.state === 'ready') {
    return (
      <div>
        <button
          type="button"
          className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue flex-nowrap"
          onClick={() => download.start(mnemonic)}
        >
          <Download className="inline-block mr-2" size={20} />
          Download
        </button>

      </div>
    );
  }

  if (download.state === 'complete') {
    const { file, fileName } = download;
    const href = URL.createObjectURL(file!);
    return (
      <div>
        <a
          className="button px-2 py-1 text-sm font-extrabold rounded bg-blue text-white"
          href={href}
          download={fileName}
        >
          Save
          {' '}
          {fileName}
        </a>
      </div>
    );
  }

  if (download.state === 'preparing') {
    return (
      <div className="text-sm px-2 text-gray-400">
        Preparing Download
      </div>
    );
  }

  if (download.state === 'downloading') {
    const current = download.current || 0;
    const total = download.total || 1;
    const width = 400;
    const pbW = Math.round((width * current) / total);
    return (
      <div className="flex flex-row items-center text-gray-500">
        <div className="text-sm px-2">
          Downloading
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-200" style={{ width: `${width}px` }}>
          <div className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-blue" style={{ width: `${pbW}px` }} />
        </div>
        <div className="px-2 text-sm">
          <Bytes value={current} />
          /
          <Bytes value={total} />
        </div>
        <div>
          <button
            type="button"
            className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue flex-nowrap"
            onClick={() => download.cancel()}
          >
            Cancel
          </button>

        </div>
      </div>
    );
  }
}
