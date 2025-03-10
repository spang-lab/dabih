'use client';

import { useState } from 'react';
import ErrorDialog from '@/app/dialog/Error';
import { Dropzone, Spinner } from '@/app/util';
import useUpload from '@/lib/hooks/upload';
import { FilePlus } from 'react-feather';
import Progress from './Progress';
import Link from 'next/link';

export default function Upload() {
  const upload = useUpload();
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File) => {
    upload.start(file);
  };
  const { state } = upload;
  const { status } = state;
  if (status === 'loading') {
    return (
      <div className='flex justify-center pt-10'>
        <Spinner />
      </div>
    );
  }

  const getMessage = () => {
    if (status === 'error') {
      return (
        <ErrorDialog message={state.error ?? "Unknown error uploading"} onClose={upload.clearError} />
      );
    }
    if (status === 'complete') {
      return (
        <div className="bg-green/30 my-3 border-green border px-3 py-2 text-gray-800 rounded-lg border-gray-200">
          <span className="font-bold text-green mr-2 ">
            Upload complete:
          </span>
          File
          <span className='font-mono mx-2'>
            {state.inode?.data.fileName}
          </span>
          uploaded successfully.
          Manage your data
          <Link
            href="/manage"
            className="text-blue mx-2 hover:underline">
            here
          </Link>
        </div>
      );
    }
    return null;
  }

  const getCancel = () => {
    if (status !== "interrupted" && status !== "uploading") {
      return null;
    }
    return (
      <div className='flex justify-center'>
        <button
          className='bg-gray-500 text-white font-bold px-2 py-1 rounded-lg'
          onClick={() => upload.cancel()}
        >
          Cancel upload
        </button>
      </div>
    );

  }


  return (
    <div>
      <ErrorDialog message={error} onClose={() => setError(null)} />
      {getMessage()}
      <Progress state={upload.state} />
      {getCancel()}
      <div className="h-80 px-20 mt-5">
        <Dropzone
          onFile={onFile}
          onError={(e: string) => setError(e)}
        >
          <div>
            <div className="flex justify-center mt-9">
              <FilePlus size={90} className="text-blue" />
            </div>
            <div className="py-3">
              <button
                type="button"
                className="px-5 py-3 text-3xl bg-blue rounded-xl text-white"
              >
                Upload a file
              </button>
            </div>
          </div>
        </Dropzone>
      </div>
    </div>
  );
}
