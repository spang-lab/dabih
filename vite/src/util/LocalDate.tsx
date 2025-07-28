export default function LocalDate({ value, showTime = true }:
  { value: number | string | Date | null, showTime?: boolean }) {
  if (!value) {
    return null;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  };


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
        {value.toString()}
      </span>
    );
  }

  if (showTime) {
    return (
      <span>
        {' '}
        {date.toLocaleString("de", options)}
        {' '}
      </span>
    );
  }
  return (
    <span>
      {' '}
      {date.toLocaleDateString("de", options)}
      {' '}
    </span>
  );
}
