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
        <div className="block px-3 py-2 font-semibold rounded-md text-white bg-main-dark" aria-current="page">
          {children}
        </div>
      );
    }
    return (
      <Link href={href} className="block px-3 py-2 font-semibold rounded-md bg-gray-mid text-white">
        {children}
      </Link>
    );
  }
  if (isActive) {
    return (
      <div className="px-3 py-2 font-semibold rounded-md text-active bg-main-dark" aria-current="page">
        {children}
      </div>
    );
  }
  return (
    <Link href={href} className="px-3 py-2 font-semibold rounded-md bg-main-mid text-gray-light">
      {children}
    </Link>
  );
}
export default NavLink;
