'use client';

import React from 'react';
import Link from 'next/link';
import { useInfo } from '@/lib/hooks';

export default function AdminContact() {
  const { info } = useInfo();
  const enc = (text) => encodeURIComponent(text);

  const admin = info?.branding?.admin;
  if (!admin) {
    return null;
  }

  const { email, name } = admin;
  const subject = enc('Dabih unlock request');
  const text = enc('Please unlock my dabih key');

  return (
    <div className="p-2">
      <span>{name}</span>
      <Link
        className="px-3 py-1 m-3 border rounded-lg border-blue hover:border-gray-1000"
        href={`mailto:${email}?subject=${subject}&body=${text}`}
      >
        Contact me
      </Link>
    </div>
  );
}
