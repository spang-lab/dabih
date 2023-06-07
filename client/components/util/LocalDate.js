import React from 'react';

export default function LocalDate({ value, showTime = true }) {
  if (!value) {
    return null;
  }
  const locale = process.env.LOCALE || 'de-DE';
  const dateString = value.replace(/\s\+/, '+');
  const date = new Date(dateString);
  if (showTime) {
    return (
      <span>
        {' '}
        {date.toLocaleString(locale)}
        {' '}
      </span>
    );
  }
  return (
    <span>
      {' '}
      {date.toLocaleDateString(locale)}
      {' '}
    </span>
  );
}
