'use client';

import React from 'react';
import Link from 'next/link';
import { useInfo } from '../hooks';

function Footer() {
  const { info } = useInfo();

  const branding = info?.branding;
  const department = branding?.department;
  const organization = branding?.organization;

  return (
    <div className="p-5 text-center text-gray-400 border-t">
      <p>
        <Link href={department?.url || '#'}>{department?.name}</Link>
        {' '}
        -
        {' '}
        <Link href={organization?.url || '#'}>{organization?.name}</Link>
      </p>
      <p>
        ©
        {new Date().getFullYear()}
        <span className="px-2"> · </span>
        Version
        {' '}
        {info?.version}
      </p>
      <Link className="text-blue hover:underline" href="/docs/contact">
        Contact/Impressum
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs/privacy">
        Privacy Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs/data_policy">
        Data Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs">
        Documentation
      </Link>
    </div>
  );
}

export default Footer;
