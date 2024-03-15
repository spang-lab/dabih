'use client';

import React from 'react';
import { formatBytes } from '../util';

export default function UploadProgress(props: any) {
  const {
    current, total, fileName, running,
  } = props;
  if (!current && current !== 0) {
    return null;
  }
  if (!total && total !== 0) {
    return null;
  }

  const percent = Math.round((1000 * current) / total) / 10;

  const width = 20;
  const center = 384 / 2;
  const radius = center - width / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  const getLoader = () => {
    if (running) {
      return (
        <div className="animate-upload mx-auto relative left-[-100px] w-4 h-4 text-gray-500 rounded m-4  box-border" />
      );
    }
    return (
      <div className="text-center p-2 text-gray-500">
        <p className="font-bold text-red">Upload has been interrupted.</p>
        Select the file again to continue uploading.
      </div>
    );
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
          className="text-gray-400"
        />

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
          className="text-blue -rotate-90 origin-center"
        />
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
          {formatBytes(current)}
          /
          {formatBytes(total)}
          )
        </text>
      </svg>
      <div>
        {getLoader()}
      </div>
    </div>
  );
}
