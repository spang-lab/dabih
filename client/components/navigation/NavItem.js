import React from 'react';
import { Link } from '../util';

export default function NavItem(props) {
  const {
    state, label, href, children,
  } = props;
  if (state === 'complete') {
    return (
      <Link href={href}>
        <div className="relative flex items-center text-emerald-600">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-emerald-600">
            {children}
          </div>
          <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-emerald-600">
            {label}
          </div>
        </div>
      </Link>
    );
  }
  if (state === 'enabled') {
    return (
      <Link href={href}>

        <div className="relative flex items-center text-sky-600 border-sky-600">
          <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full border-sky-600">
            <div className="text-center">
              {children}
            </div>
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
        <div className="flex items-center justify-center w-12 h-12 py-3 border-2 rounded-full bg-sky-600 border-sky-600">
          <div className="text-center">
            {children}
          </div>
        </div>
        <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center uppercase text-sky-600">
          {label}
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex items-center text-gray-500">
      <div className="flex items-center justify-center w-12 h-12 py-3 border-2 border-gray-300 rounded-full ease-in-out">
        {children}
      </div>
      <div className="absolute top-0 w-32 mt-16 -ml-10 text-xs font-medium text-center text-gray-500 uppercase">
        {label}
      </div>

    </div>
  );
}
