/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';

function BasicLink(props) {
  const {
    href, className, children, muted, target,
  } = props;
  let aClassName = `${className} text-main-200 hover:text-gray-1000`;
  if (muted) {
    aClassName = `${className} text-gray-400 underline hover:underline-offset-2 hover:text-gray-400`;
  }
  return (
    <Link target={target} className={aClassName} href={href}>
      {children}
    </Link>
  );
}
export default BasicLink;
