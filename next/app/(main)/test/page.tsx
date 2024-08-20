
'use client';

import { Dropzone } from '@/app/util';

export default function Test() {
  const onDrop = (files) => {
    console.log(files);
  };
  return (
    <Dropzone onFile={onDrop} onError={onDrop}>
      <button
        type="button"
        className="px-5 py-3 text-3xl bg-blue rounded-xl text-white"
      >
        Upload
      </button>
    </Dropzone>
  );
}
