import React from 'react';

export default function TimeSince({ value }) {
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
