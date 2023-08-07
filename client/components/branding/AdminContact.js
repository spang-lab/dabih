import React from 'react';
import { Link } from '../util';

export default function AdminContact() {
  const enc = (text) => encodeURIComponent(text);

  const mail = 'michael.huttner@ukr.de';
  const subject = enc('Dabih unlock request');
  const text = enc('Please unlock my dabih key');

  return (
    <div className="p-2">
      <span>Michael Huttner</span>
      <Link
        className="px-3 py-1 m-3 border rounded-lg border-blue hover:border-gray-1000"
        href={`mailto:${mail}?subject=${subject}&body=${text}`}
      >
        Contact me
      </Link>
    </div>
  );
}
