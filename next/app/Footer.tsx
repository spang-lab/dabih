import React from 'react';
import Link from 'next/link';
import api from '@/lib/api';


export default async function Footer() {
  const { data: info } = await api.util.info();

  const branding = info?.branding;
  const department = branding?.department;
  const organization = branding?.organization;

  return (
    <footer className="p-2 space-x-2 flex flex-row flex-wrap justify-center text-gray-400 border-t border-gray-200">
      <div>
        <Link href={department?.url ?? '#'}>{department?.name}</Link>
        {' '}
        -
        {' '}
        <Link href={organization?.url ?? '#'}>{organization?.name}</Link>
      </div>
      <div>
        ©
        {new Date().getFullYear()}
        <span className="px-2"> · </span>
        Version
        {' '}
        {info?.version}
      </div>
      <Link className="text-blue hover:underline" href="/docs/contact">
        Contact/Impressum
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs/privacy">
        Privacy Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs/data">
        Data Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/docs">
        Documentation
      </Link>
    </footer>
  );
}
