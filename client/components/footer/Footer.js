'use client';
import React from 'react';
import Link from 'next/link';
import info from '../../package.json';

function Footer() {
  const { version } = info;
  return (
    <div className="p-5 text-center text-gray-400 border-t">
      <p>
        <Link href="www.spang-lab.de">Institute of functional genomics</Link>
        <span className="px-2">-</span>
        Statistical Bioinformatics
      </p>
      <p>
        <Link href="www.uni-regensburg.de">University of Regensburg</Link>
      </p>
      <p>
        ©
        {new Date().getFullYear()}
        <span className="px-2"> · </span>
        Version
        {' '}
        {version}
      </p>
      <Link className="text-blue hover:underline" href="/contact">
        Contact/Impressum
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/privacy">
        Privacy Policy
      </Link>
      <span className="px-2"> · </span>
      <Link className="text-blue hover:underline" href="/data_policy">
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
