'use client';

import React from 'react';
import {
  File, FileText, Lock, X,
} from 'react-feather';
import {
  Bytes, LocalDate, TimeSince,
} from '@/app/util';
import Members from './Members';
import DatasetActions from './DatasetActions';
import DownloadButton from './DownloadButton';

export default function Dataset({ data }) {
  const {
    mnemonic,
    name,
    size,
    fileName,
    createdBy,
    createdAt,
    permission,
    deletedAt,
  } = data;

  const getName = () => {
    if (!name) {
      return null;
    }
    return (
      <div className="px-3 py-2 text-center border-gray-400 border-r-2">
        <p className="font-semibold">Name </p>
        <span className="px-3 py-1 m-1 font-medium border rounded text-blue border-blue">
          {name}
        </span>
      </div>
    );
  };
  const getDeleted = () => {
    if (!deletedAt) {
      return null;
    }
    return (
      <span className="px-3 py-1 mx-1 font-semibold text-red ">
        Deleted
        {' '}
        <TimeSince value={deletedAt} />
      </span>
    );
  };

  const getIcon = () => {
    if (permission === 'none') {
      return (
        <div className="relative mx-auto w-14 h-14">
          <File className="text-gray-400" size={56} />
          <X
            className="absolute text-gray-400 bottom-1 left-2"
            strokeWidth={3}
            size={35}
          />
        </div>
      );
    }
    if (deletedAt) {
      return (
        <div className="relative mx-auto w-14 h-14">
          <FileText className="text-gray-500" size={56} />
          <X
            className="absolute text-red -bottom-1 -right-1"
            strokeWidth={3}
            size={40}
          />
        </div>
      );
    }
    return (

      <div className="relative mx-auto w-14 h-14">
        <FileText className="" size={56} />
        <Lock
          className="absolute text-red -bottom-1 -right-1"
          strokeWidth={3}
          size={30}
        />
      </div>
    );
  };

  return (
    <div className="m-2 px-2 mx-auto border border-gray-400 rounded-xl space-x-4">
      <div className="flex flex-row flex-wrap items-center py-1 pl-5 text-sm md:text-base rounded-xl space-x-2">
        <div className="shrink-0 text-blue justify-self-start">
          {getIcon()}
        </div>
        <div className="px-3 py-2 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Filename</p>
          <span className="text-blue">
            {fileName}
          </span>
        </div>
        <div className="px-3 py-2 text-center border-gray-400 border-r-2">
          <p className="font-semibold">mnemonic</p>
          <span className="text-blue font-extrabold font-mono">
            {mnemonic}
          </span>
        </div>
        <div className="px-3 py-2 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Upload Date</p>
          <LocalDate value={createdAt} />
        </div>
        <div className="px-3 py-2 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Uploaded by</p>
          {createdBy}
        </div>
        <div className="px-3 py-2 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Size</p>
          <span className="text-sm">
            <Bytes binary value={size} />
            (
            <Bytes value={size} />
            )
          </span>
        </div>
        {getName()}
        {getDeleted()}
      </div>
      <div>
        <div className="flex flex-row flex-wrap justify-between">
          <div className="grow bg-white">
            <Members data={data} />
          </div>
          <div className="px-3 py-2 flex flex-row">
            <DownloadButton mnemonic={mnemonic} enabled={!deletedAt && permission !== 'none'} />
            <DatasetActions data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
