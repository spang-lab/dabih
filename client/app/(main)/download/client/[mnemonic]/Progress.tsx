'use client';

import React from 'react';
import { Bytes } from '@/app/util';

export default function DownloadProgress(props) {
  const { current, total, fileName } = props;
  if (!fileName || !total) {
    return null;
  }

  const percent = Math.round((1000 * current) / total) / 10;

  const width = 20;
  const center = 384 / 2;
  const radius = center - width / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="w-1/2 pt-5 mx-auto">
      <p className="p-3 text-xl text-center text-gray-400">
        Downloading file &quot;
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
        <div className="animate-download mx-auto relative left-[-100px] w-4 h-4 text-gray-500 rounded m-4  box-border" />
      </div>
    </div>
  );
}
