import React from 'react';

export default function DownloadButton(props) {
  const {
    children, className, file, fileName, onDownload,
  } = props;
  if (!file) {
    return null;
  }

  const href = URL.createObjectURL(file);

  const classes = `
    button
    px-2 py-1 text-sm font-extrabold rounded
    bg-main-mid hover:bg-main-mid
    text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white
    ${className}`;
  return (
    <a href={href} download={fileName} className={classes} onClick={onDownload}>
      {children}
    </a>
  );
}
