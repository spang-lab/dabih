import React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useRouter } from 'next/router';

function NavLink(props) {
  const router = useRouter();
  const { href, children, block } = props;
  const isActive = router.asPath === href;

  if (block) {
    if (isActive) {
      return (
        <div
          className="block px-3 py-2 font-semibold rounded-md text-white bg-purple"
          aria-current="page"
        >
          {children}
        </div>
      );
    }
    return (
      <Link
        href={href}
        className="block px-3 py-2 font-semibold rounded-md bg-blue text-gray-300"
      >
        {children}
      </Link>
    );
  }
  if (isActive) {
    return (
      <div
        className="px-3 py-2 font-semibold rounded-md text-white bg-purple"
        aria-current="page"
      >
        {children}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="px-3 py-2 font-semibold rounded-md bg-blue  hover:text-white text-gray-300"
    >
      {children}
    </Link>
  );
}
export default NavLink;
