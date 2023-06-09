import React from 'react';
import { Link } from '../util';

export default function NavItem(props) {
  const {
    state, label, href, children,
  } = props;
  if (state === 'complete') {
    return (
      <Link href={href}>
        <div className="relative flex items-center text-main-200">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-main-200">
            {children}
          </div>
          <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-main-200">
            {label}
          </div>
        </div>
      </Link>
    );
  }
  if (state === 'enabled') {
    return (
      <Link href={href}>
        <div className="relative flex items-center text-main-200 border-main-200">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-main-200">
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
        <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full bg-main-200 border-main-200">
          <div className="text-center">{children}</div>
        </div>
        <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-main-200">
          {label}
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex items-center text-gray-400">
      <div className="flex items-center justify-center w-12 h-12 py-3 border-2 border-gray-400 rounded-full ease-in-out">
        {children}
      </div>
      <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center text-gray-400 uppercase">
        {label}
      </div>
    </div>
  );
}
