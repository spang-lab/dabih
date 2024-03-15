'use client';

import React from 'react';

export default function DownloadButton(props) {
  const {
    children, className, file, fileName, onDownload,
  } = props;
  if (!file) {
    return null;
  }

  const encoded = window.encodeURIComponent(file);
  const href = `data:text/plain;charset=utf-8,${encoded}`;

  const classes = `
    button
    px-3 py-3 text-lg rounded
    text-gray-100 bg-blue hover:bg-blue
    hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
    ${className}`;
  return (
    <a href={href} download={fileName} className={classes} onClick={onDownload}>
      {children}
    </a>
  );
}
