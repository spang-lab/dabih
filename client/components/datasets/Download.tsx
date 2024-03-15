'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download } from 'react-feather';
import { Spinner } from '../util';
import DownloadButton from './DownloadButton';
import { useDatasets } from './Context';
import FilesystemDownload from './FilesystemDownload';

export default function DownloadDataset({ mnemonic, size, enabled }) {
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(null);
  const { downloadDataset } = useDatasets();

  const oneMiB = 1024 * 1024;
  const sizeThreshold = 80 * oneMiB;

  const doesSupportFileSystem = !!window.showSaveFilePicker;

  const onClick = async () => {
    setLoading(true);
    const result = await downloadDataset(mnemonic);
    setDownload(result);
    setLoading(false);
  };

  if (!enabled) {
    return (
      <div>
        <button
          type="button"
          disabled
          className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue/40 flex-nowrap"
          onClick={onClick}
        >
          <Download className="inline-block mr-2" size={20} />
          Download
        </button>
      </div>
    );
  }

  if (doesSupportFileSystem) {
    return (
      <div>
        <FilesystemDownload mnemonic={mnemonic} />
      </div>
    );
  }

  if (size > sizeThreshold) {
    return (
      <div className="px-2 font-semibold">
        <Link
          className="text-blue hover:underline"
          href={`/download/${mnemonic}`}
        >
          <Download className="inline-block mr-2" size={20} />
          Download
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-row px-2 py-1 font-extrabold text-white rounded bg-blue">
        <Spinner small white />
        <span className="pl-2">Downloading...</span>
      </div>
    );
  }
  if (download) {
    return (
      <DownloadButton file={download.file} fileName={download.name}>
        Save
        {' '}
        {download.name}
      </DownloadButton>
    );
  }
  return (
    <div>
      <button
        type="button"
        className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue hover:bg-blue flex-nowrap"
        onClick={onClick}
      >
        <Download className="inline-block mr-2" size={20} />
        Download
      </button>
    </div>
  );
}
