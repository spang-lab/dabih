export default function LocalDate({ value, showTime = true }) {
  if (!value) {
    return null;
  }
  const locale = process.env.LOCALE || 'de-DE';
  let date: Date | null = null;
  if (typeof value === 'number') {
    date = new Date(value);
  }
  if (typeof value === 'string') {
    const dateString = value.replace(/\s\+/, '+');
    date = new Date(dateString);
  }
  if (!date) {
    return (
      <span>
        Invalid date value
        {' '}
        {value}
      </span>
    );
  }

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
