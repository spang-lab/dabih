import React from 'react';
import Link from 'next/link';

function BasicLink(props) {
  const { href, children } = props;
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        target="_blank"
        className="text-blue font-semibold"
        rel="noreferrer"
      >
        {children}
      </a>

    );
  }
  return (
    <Link href={href} className="text-blue font-semibold">
      {children}
    </Link>

  );
}
export default BasicLink;
