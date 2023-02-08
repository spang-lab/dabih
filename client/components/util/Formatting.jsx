import React from 'react';

export function Bytes({ value }) {
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };
  return (
    <span>
      {' '}
      {formatBytes(value)}
      {' '}
    </span>
  );
}
export function LocalDate({ value }) {
  const date = new Date(value).toLocaleString('de-DE');
  return (
    <span>
      {' '}
      {date}
      {' '}
    </span>
  );
}
export function LocalDay({ value }) {
  const date = new Date(value).toLocaleDateString('de-DE');
  return (
    <span>
      {' '}
      {date}
      {' '}
    </span>
  );
}

export function TimeSince({ value }) {
  const now = new Date();
  const date = new Date(value);

  const diff = now - date;
  const oneMinute = 1000 * 60;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;

  const getValue = (v, unit) => {
    const rounded = Math.floor(v);
    if (rounded === 1) {
      return `${rounded} ${unit} ago`;
    }
    return `${rounded} ${unit}s ago`;
  };

  if (diff < oneHour) {
    return (
      <span>
        {' '}
        {getValue(diff / oneMinute, 'minute')}
        {' '}
      </span>
    );
  }
  if (diff < oneDay) {
    return (
      <span>
        {' '}
        {getValue(diff / oneHour, 'hour')}
        {' '}
      </span>
    );
  }
  return (
    <span>
      {' '}
      {getValue(diff / oneDay, 'day')}
      {' '}
    </span>
  );
}

export function Title1({ children, className }) {
  const classes = `text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl ${className}`;
  return (
    <h1 className={classes}>
      {children}
    </h1>
  );
}

export function Title2({ children, className }) {
  const classes = `text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl ${className}`;
  return (
    <h2 className={classes}>
      {children}
    </h2>
  );
}
export function Title3({ children, className }) {
  const classes = `text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl md:text-3xl ${className}`;
  return (
    <h3 className={classes}>
      {children}
    </h3>
  );
}

export function Subtitle1({ children }) {
  return (
    <div className="mx-2 mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-4">
      {children}
    </div>
  );
}

export function Highlight({ children }) {
  return (
    <>
      {' '}
      <span className="font-semibold text-sky-700">
        {children}
      </span>
      {' '}
    </>
  );
}
export function Danger({ children }) {
  return (
    <>
      {' '}
      <span className="font-extrabold underline text-rose-800">
        {children}
      </span>
      {' '}
    </>
  );
}

export function Color({ children }) {
  return (
    <>
      {' '}
      <span className="text-sky-700">
        {children}
      </span>
      {' '}
    </>
  );
}

export function Code({ children }) {
  return (
    <>
      {' '}
      <span className="px-1 font-semibold text-gray-400">
        `
        {children}
        `
      </span>
      {' '}
    </>
  );
}
export function CodeBlock({ children }) {
  return (
    <div className="w-3/4 overflow-scroll border border-gray-300 rounded">
      <pre className="p-1 text-xs font-semibold text-gray-400 xl:text-base">
        {children}
      </pre>
    </div>
  );
}
export function Gray({ children }) {
  return (
    <>
      {' '}
      <span className="text-gray-500">
        {children}
      </span>
      {' '}
    </>
  );
}
