'use client';

import React from 'react';
import {
  File, FileText, Trash2, X, AlertTriangle,
} from 'react-feather';
import {
  Bytes, LocalDate, TimeSince,
} from '../util';

export default function Orphan({ data, onRemove, onDestroy }) {
  const {
    mnemonic,
    name,
    size,
    fileName,
    createdBy,
    createdAt,
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
    if (deletedAt) {
      return (
        <div className="relative mx-auto w-8 h-8">
          <FileText className="text-gray-500" size={28} />
          <X
            className="absolute text-red bottom-0 right-0"
            strokeWidth={2}
            size={20}
          />
        </div>
      );
    }
    return (
      <div className="relative mx-auto w-8 h-8">
        <File className="text-gray-400" size={28} />
      </div>
    );
  };
  const getDelete = () => {
    if (deletedAt) {
      return (
        <div>
          <button
            type="button"
            className="bg-red inline-flex items-center text-white px-2 py-1 rounded-md"
            onClick={onDestroy}
          >
            <div className="relative w-6 h-6 mx-1">
              <Trash2 size={24} />
              <AlertTriangle
                className="absolute -bottom-1 -right-1"
                size={14}
              />
            </div>
            Destroy forever
          </button>
        </div>
      );
    }
    return (
      <div>
        <button
          type="button"
          className="bg-red text-white px-2 py-1 rounded-md inline-flex items-center"
          onClick={onRemove}
        >
          <Trash2 />
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className="m-2 px-2 bg-red/10 mx-auto border border-gray-400 rounded-xl space-x-4">
      <div className="flex flex-row flex-wrap items-center pl-5 text-sm rounded-xl space-x-2">
        <div className="shrink-0 text-blue justify-self-start">
          {getIcon()}
        </div>
        <div className="px-3 py-1 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Filename</p>
          <span className="text-blue">
            {fileName}
          </span>
        </div>
        <div className="px-3 py-1 text-center border-gray-400 border-r-2">
          <p className="font-semibold">mnemonic</p>
          <span className="text-blue font-extrabold font-mono">
            {mnemonic}
          </span>
        </div>
        <div className="px-3 py-1 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Upload Date</p>
          <LocalDate value={createdAt} />
        </div>
        <div className="px-3 py-1 text-center border-gray-400 border-r-2">
          <p className="font-semibold">Uploaded by</p>
          {createdBy}
        </div>
        <div className="px-3 py-1 text-center border-gray-400 border-r-2">
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
        <div className="grow" />
        {getDelete()}
      </div>
    </div>
  );
}
