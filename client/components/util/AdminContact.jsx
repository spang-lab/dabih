import React from 'react';
import { Highlight } from './Formatting';
import Link from './Link';

export default function AdminContact() {
  const enc = (text) => encodeURIComponent(text);

  const mail = 'michael.huttner@ukr.de';
  const subject = enc('Dabih unlock request');
  const text = enc('Please unlock my dabih key');

  return (
    <div className="p-2">
      <Highlight>Michael Huttner</Highlight>
      <Link
        className="px-3 py-1 border rounded-lg border-sky-700 hover:border-sky-500"
        href={`mailto:${mail}?subject=${subject}&body=${text}`}
      >
        Contact me
      </Link>
    </div>
  );
}
