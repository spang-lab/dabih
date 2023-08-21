import React from 'react';
import Link from 'next/link';

export default function NavItem(props) {
  const {
    state, label, href, children,
  } = props;
  if (state === 'hidden') {
    return null;
  }
  if (state === 'complete') {
    return (
      <Link href={href}>
        <div className="relative flex flex-col items-center text-green">
          <div className="flex items-center justify-center w-10 h-10 py-3 border-2 rounded-full border-green">
            {children}
          </div>
          <div className="pt-2 text-xs font-medium text-center uppercase">
            {label}
          </div>
        </div>
      </Link>
    );
  }
  if (state === 'enabled') {
    return (
      <Link href={href}>
        <div className="relative flex flex-col items-center text-gray-200 border-blue">
          <div className="flex items-center justify-center w-10 h-10 py-3 border-2 rounded-full border-gray-200">
            <div className="text-center">{children}</div>
          </div>
          <div className="pt-2 text-xs font-medium text-center uppercase">
            {label}
          </div>
        </div>
      </Link>
    );
  }

  if (state === 'active') {
    return (
      <div className="relative flex flex-col items-center text-orange">
        <div className="flex items-center justify-center w-10 h-10 py-3 border-2 rounded-full text-orange border-orange">
          <div className="text-center">{children}</div>
        </div>
        <div className="pt-2 text-xs font-medium text-center uppercase">
          {label}
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center text-gray-500">
      <div className="flex items-center justify-center w-10 h-10 py-3 border-2 border-gray-500 rounded-full ease-in-out">
        {children}
      </div>
      <div className=" pt-2 text-xs font-medium text-center text-gray-500 uppercase">
        {label}
      </div>
    </div>
  );
}
