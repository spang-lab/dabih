/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';

function BasicLink(props) {
  const {
    href, className, children, muted, target,
  } = props;
  let aClassName = `${className} text-main-mid hover:text-gray-light0`;
  if (muted) {
    aClassName = `${className} text-gray-mid underline hover:underline-offset-2 hover:text-gray-mid`;
  }
  return (
    <Link target={target} className={aClassName} href={href}>
      {children}
    </Link>
  );
}
export default BasicLink;
