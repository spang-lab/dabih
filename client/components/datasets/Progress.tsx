'use client';

import React from 'react';
import { formatBytes } from '../util';

export default function DownloadProgress(props) {
  const { current, total } = props;
  if (!total) {
    return null;
  }

  const percent = Math.round((1000 * current) / total) / 10;

  const width = 5;
  const center = 128 / 2;
  const radius = center - width / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="">
      <svg className="mx-auto transform w-32 h-32">
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
          dx={-10}
          dy={-30}
          y={center}
          fill="currentColor"
          dominantBaseline="central"
          className="text-lg font-semibold"
        >
          {percent}
          %
        </text>
        <text
          x={center}
          y={center}
          dy={-10}
          dx={-30}
          fill="currentColor"
          dominantBaseline="central"
          className=" text-gray-400"
        >
          complete
        </text>
        <text
          x={center}
          y={center}
          dy={15}
          dx={-20}
          fill="currentColor"
          dominantBaseline="central"
          className="text-xs text-gray-400"
        >
          (
          {formatBytes(current)}
          /
          {formatBytes(total)}
          )
        </text>
      </svg>
    </div>
  );
}
