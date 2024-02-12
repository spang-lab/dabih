'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useInfo } from '../hooks';

function Department() {
  const { info } = useInfo();
  const organization = info?.branding?.organization;
  if (!organization) {
    return null;
  }
  const { name, url, logo } = organization;

  return (
    <div className="flex flex-row">
      <div className="relative w-12 h-12">
        <Image
          className="object-contain"
          src={logo}
          alt={`${name} logo`}
          sizes="99vw"
          fill
        />
      </div>
      <div className="p-3 text-xl font-bold text-gray-400">
        <Link href={url}>
          {name}
        </Link>
      </div>
    </div>
  );
}

export default Department;
