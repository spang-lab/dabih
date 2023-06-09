import React from 'react';
import { Link } from '../util';

export default function NavItem(props) {
  const {
    state, label, href, children,
  } = props;
  if (state === 'complete') {
    return (
      <Link href={href}>
        <div className="relative flex items-center text-main-mid">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-main-mid">
            {children}
          </div>
          <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-main-mid">
            {label}
          </div>
        </div>
      </Link>
    );
  }
  if (state === 'enabled') {
    return (
      <Link href={href}>
        <div className="relative flex items-center text-main-mid border-main-mid">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-main-mid">
            <div className="text-center">{children}</div>
          </div>
          <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase">
            {label}
          </div>
        </div>
      </Link>
    );
  }

  if (state === 'active') {
    return (
      <div className="relative flex items-center text-white">
        <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full bg-main-mid border-main-mid">
          <div className="text-center">{children}</div>
        </div>
        <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-main-mid">
          {label}
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex items-center text-gray-mid">
      <div className="flex items-center justify-center w-12 h-12 py-3 border-2 border-gray-mid rounded-full ease-in-out">
        {children}
      </div>
      <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center text-gray-mid uppercase">
        {label}
      </div>
    </div>
  );
}
