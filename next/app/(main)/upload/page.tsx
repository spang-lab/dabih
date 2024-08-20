'use client';

import { useState } from 'react';
import ErrorDialog from '@/app/dialog/Error';
import { Dropzone } from '@/app/util';
import useUpload from '@/lib/hooks/upload';
import { FilePlus } from 'react-feather';

export default function Upload() {
  const upload = useUpload();
  const [error, setError] = useState<string | null>(null);


  const onFile = (file: File) => {
    upload.start(file);
  };

  return (
    <div>
      <ErrorDialog message={error} onClose={() => setError(null)} />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Upload
        {' '}
        <span className="text-blue">your data</span>
      </h1>
      <pre>{upload.debug}</pre>
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
