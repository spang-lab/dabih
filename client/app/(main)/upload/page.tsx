'use client';

import React from 'react';

import { Upload } from '@/components';
import { useUser } from '@/lib/hooks';

export default function UploadPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Upload
        {' '}
        <span className="text-blue">your data</span>
      </h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Upload disabled={false} />
    </div>
  );
}
