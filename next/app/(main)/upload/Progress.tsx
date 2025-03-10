'use client';

import React from 'react';
import { Bytes } from '@/app/util';
import type { UploadState } from '@/lib/hooks/upload';

export default function UploadProgress({ state }: { state: UploadState }) {
  const { inode, status } = state;
  if (status === 'complete') {
    return null;
  }
  if (!inode) {
    return null;
  }
  const { chunks, fileName } = inode.data;
  let current = 0;
  if (chunks.length) {
    const { end } = chunks.at(-1)!;
    current = parseInt(end as string, 10) + 1;
  }
  const size = state.file?.size ?? inode.data.size;
  if (!size) {
    return null;
  }
  const total = parseInt(size as string, 10);

  const percent = Math.round((1000 * current) / total) / 10;

  const width = 20;
  const center = 384 / 2;
  const radius = center - width / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  const getLoader = () => {
    if (status === "uploading") {
      return (
        <div className="animate-upload mx-auto relative left-[-100px] w-4 h-4 text-gray-500 rounded-sm m-4  box-border" />
      );
    }
    if (status === "interrupted") {
      return (
        <div className="text-center p-2 text-gray-500">
          <p className="font-bold text-red">Upload has been interrupted.</p>
          Select the file again to continue uploading.
        </div>
      );
    }
  };

  return (
    <div className="w-1/2 pt-5 mx-auto">
      <p className="p-3 text-xl text-center text-gray-400">
        Uploading file &quot;
        {fileName}
        &quot;
      </p>
      <svg className="mx-auto transform w-96 h-96">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={width}
          fill="transparent"
          className="text-gray-300 origin-center"
        />

        <g transform={`rotate(-90, ${center}, ${center})`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={width}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-blue"
          />
        </g>
        <text
          x={center}
          dx={-50}
          dy={-20}
          y={center}
          fill="currentColor"
          dominantBaseline="central"
          className="text-6xl font-semibold"
        >
          {percent}
          %
        </text>
        <text
          x={center}
          y={center}
          dy={20}
          dx={-50}
          fill="currentColor"
          dominantBaseline="central"
          className="text-2xl text-gray-400"
        >
          complete
        </text>
        <text
          x={center}
          y={center}
          dy={65}
          dx={-50}
          fill="currentColor"
          dominantBaseline="central"
          className="text-lg text-gray-400"
        >
          (
          <Bytes value={current} />
          /
          <Bytes value={total} />
          )
        </text>
      </svg>
      <div>
        {getLoader()}
      </div>
    </div>
  );
}
