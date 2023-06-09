import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { File, FilePlus } from 'react-feather';
import { BigButton } from '../util';

export default function Dropzone({ onChange, disabled }) {
  const onDrop = useCallback(onChange, [onChange]);

  const {
    getRootProps, getInputProps, isDragActive, isDragReject,
  } = useDropzone({ onDrop, disabled });

  const getCenter = () => {
    if (isDragReject) {
      return <p>NO</p>;
    }
    if (isDragActive) {
      return (
        <p>
          <FilePlus size={80} />
        </p>
      );
    }
    return (
      <div className="text-xl text-center">
        <File size={60} className="mx-auto" />
        <p>Drag and drop your files here or click</p>
        <div className="py-3">
          <BigButton disabled={disabled}>Upload</BigButton>
        </div>
        <p>to select files.</p>
      </div>
    );
  };
  let className = 'border-main-200 bg-gray-100';
  if (disabled) {
    className = 'bg-gray-100 border-gray-400';
  }

  return (
    <div
      {...getRootProps()}
      className={`w-1/2 p-5 mx-auto mt-5 border-4 border-dashed grid place-content-center rounded-3xl h-80 ${className}`}
    >
      <input {...getInputProps()} />
      {getCenter()}
    </div>
  );
}
