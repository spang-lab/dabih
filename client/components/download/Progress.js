'use client';
import React from 'react';
import styles from './Progress.module.css';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

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
        <span className={styles.loader} />
      </div>
    </div>
  );
}
