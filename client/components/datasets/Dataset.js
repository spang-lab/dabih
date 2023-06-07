import React from 'react';
import { FileText, Lock } from 'react-feather';
import { Bytes, LocalDate } from '../util';
import Download from './Download';
import Members from './Members';
import DatasetActions from './DatasetActions';

export default function Dataset({ data }) {
  const {
    mnemonic, name, hash, size, fileName, createdBy, createdAt,
  } = data;

  const getName = () => {
    if (!name) {
      return null;
    }
    return (
      <span className="px-3 py-1 font-medium border rounded text-sky-700 border-sky-700">
        {name}
      </span>
    );
  };

  return (
    <div className="px-3 m-3 mx-auto bg-white border border-gray-300 rounded-xl space-x-4">
      <div className="flex flex-row justify-between py-2">
        <div className="flex flex-row flex-wrap">
          <div className="text-xl font-extrabold">
            Encrypted Dataset
            <span className="text-sky-700">
              {' '}
              {mnemonic}
              {' '}
            </span>
          </div>
          <div className="m-1">{getName()}</div>
        </div>
        <div className="flex flex-row items-center">
          <Download size={size} mnemonic={mnemonic} />
          <DatasetActions data={data} />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center py-1 pl-5 text-sm border-gray-300 md:text-base rounded-xl space-x-2">
        <div className="shrink-0 text-sky-700 justify-self-start">
          <div className="relative mx-auto w-14 h-14">
            <FileText className="" size={56} />
            <Lock
              className="absolute text-rose-700 -bottom-1 -right-1"
              strokeWidth={3}
              size={30}
            />
          </div>
        </div>
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
      <div>
        <div className="flex flex-row flex-wrap justify-between">
          <div className="w-full xs:w-1/2">
            <Members data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
