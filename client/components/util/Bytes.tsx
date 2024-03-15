'use client';

import React from 'react';

export const formatBytes = (bytes, decimals = 2, binary = true) => {
  if (!bytes || bytes === 0) return '0 B';
  const dm = decimals < 0 ? 0 : decimals;
  const sizesBinary = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const sizesBase10 = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const k = (binary) ? 1024 : 1000;
  const sizes = (binary) ? sizesBinary : sizesBase10;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export function Bytes({ value }) {
  return (
    <span>
      {' '}
      {formatBytes(value)}
      {' '}
    </span>
  );
}
export function Bytes10({ value }) {
  return (
    <span>
      {' '}
      {formatBytes(value, 2, false)}
      {' '}
    </span>
  );
}
