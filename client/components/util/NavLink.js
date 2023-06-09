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
        <div className="block px-3 py-2 font-semibold rounded-md text-white bg-main-300" aria-current="page">
          {children}
        </div>
      );
    }
    return (
      <Link href={href} className="block px-3 py-2 font-semibold rounded-md bg-gray-400 text-white">
        {children}
      </Link>
    );
  }
  if (isActive) {
    return (
      <div className="px-3 py-2 font-semibold rounded-md text-white bg-main-100" aria-current="page">
        {children}
      </div>
    );
  }
  return (
    <Link href={href} className="px-3 py-2 font-semibold rounded-md bg-main-200 hover:text-white text-gray-200">
      {children}
    </Link>
  );
}
export default NavLink;
