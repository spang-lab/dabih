import React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useRouter } from 'next/router';

function NavLink(props) {
  const router = useRouter();
  const { href, children, block } = props;
  const isActive = router.asPath === href;

  const classes = ['px-3', 'py-2', 'font-medium', 'rounded-md'];
  if (block) {
    classes.push('block', 'text-base');
  } else {
    classes.push('text-sm');
  }

  const activeClasses = [...classes, 'text-white', 'bg-gray-900'].join(' ');
  const inactiveClasses = [
    ...classes,
    'text-gray-300',
    'bg-gray-700',
    'hover:text-white',
  ].join(' ');

  if (isActive) {
    return (
      <Link href={href} className={activeClasses} aria-current="page">
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={inactiveClasses}>
      {children}
    </Link>
  );
}
export default NavLink;
