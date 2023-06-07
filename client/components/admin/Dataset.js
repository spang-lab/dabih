import React from 'react';
import {
  Bytes, LocalDate, TimeSince,
} from '../util';
import Actions from './DatasetActions';

function File({ data }) {
  const {
    size, fileName, createdBy, createdAt, hash,
  } = data;
  return (
    <div className="flex flex-row flex-wrap items-center py-1 pl-5 text-sm border-gray-300 rounded-xl space-x-2">
      <div className="px-3 py-2 text-center border-r-2">
        <p className="font-semibold">Filename</p>
        <span className="text-sky-700">
          {' '}
          {fileName}
          {' '}
        </span>
      </div>
      <div className="px-3 py-2 text-center border-r-2">
        <p className="font-semibold">Upload Date</p>
        <LocalDate value={createdAt} />
      </div>
      <div className="px-3 py-2 leading-none text-center border-r-2 w-52">
        <p className="font-semibold">Hash</p>
        <span className="text-xs break-words">{hash}</span>
      </div>
      <div className="px-3 py-2 text-center border-r-2">
        <p className="font-semibold">Uploaded by</p>
        {createdBy}
      </div>
      <div className="px-3 py-2 text-center border-r-2">
        <p className="font-semibold">Size</p>
        <Bytes value={size} />
      </div>
    </div>
  );
}

export default function Dataset({ data, onAction }) {
  const { mnemonic, name, deleted } = data;

  const getDeleted = () => {
    if (!deleted) {
      return null;
    }
    return (
      <span className="text-rose-700">
        Deleted
        <TimeSince value={deleted} />
      </span>
    );
  };

  return (
    <div className="p-2 m-3 mx-auto text-sm bg-white border border-gray-300 rounded-xl space-x-4">
      <div className="container mx-auto">
        <span className="float-right">
          <Actions data={data} onAction={onAction} />
        </span>
        <p>
          Dataset
          <span className="font-semibold text-sky-700">
            {' '}
            {mnemonic}
            {' '}
          </span>
        </p>
        {getDeleted()}
        <div className="font-medium text-black">{name}</div>
        <File data={data} />
      </div>
    </div>
  );
}
