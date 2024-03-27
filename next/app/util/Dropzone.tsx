/* eslint-disable react/jsx-props-no-spreading  */

'use client';

import { FileRejection, useDropzone } from 'react-dropzone';
import { FilePlus, X } from 'react-feather';

export default function Dropzone({
  children,
  onFile,
  onError,
  maxSize = Infinity,
  disabled = false,
  maxFiles = 1,
}) {
  const onDrop = (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    if (files.length > 1) {
      onError(`Only a single file is supported. Recieved ${files.length}`);
      return;
    }
    const [file] = files;
    onFile(file);
  };
  const onDropRejected = (rejections: FileRejection[]) => {
    if (rejections.length === 0) {
      return;
    }
    if (rejections.length > 1) {
      onError(`Only a single file is supported. Recieved ${rejections.length}`);
      return;
    }
    const [rejection] = rejections;
    const error = rejection.errors.map((e) => e.message).join('; ');
    onError(error);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    maxSize,
    multiple: maxFiles > 1,
    disabled,
    maxFiles,
    onDropRejected,
  });

  const getContent = () => {
    if (isDragActive) {
      return (
        <div className="grow justify-center items-center flex flex-col text-green text-xl">
          <FilePlus size={80} />
          Drop File
        </div>
      );
    }
    return (
      <div className="grow justify-center items-center flex">
        {children}
      </div>
    );
  };
  if (disabled) {
    return (
      <div
        {...getRootProps()}
        className="bg-blue/20 w-full shadow-inner border-dashed
        border-2 border-blue h-full flex-col flex rounded-3xl"
      >
        <input {...getInputProps()} />
        <div className="flex grow justify-center items-center">
          <div className="relative">
            <FilePlus className="text-blue" size={80} />
            <X className="absolute -inset-12 text-red/80" size={180} strokeWidth={1} />
          </div>
        </div>
        <div className="text-center font-thin text-lg py-2">
          Drag and drop is disabled.
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="bg-gray-100 w-full shadow-inner border-2 border-blue  h-full flex-col flex rounded-3xl"
    >
      <input {...getInputProps()} />
      {getContent()}
      <div className="text-center font-thin py-2 text-gray-500">
        Drag and drop your file here or click to select a file.
      </div>
    </div>
  );
}
