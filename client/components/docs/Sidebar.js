import { useRouter } from 'next/router';
import React from 'react';

import { Link } from '../util';

function Header({ children }) {
  return (
    <div className="p-2 text-lg font-extrabold text-gray-400">{children}</div>
  );
}
function Item({ children, href }) {
  const router = useRouter();

  if (router.asPath === href) {
    return (
      <div className="py-2 font-semibold text-white bg-blue">
        <span className="mx-4 border-l border-white" />
        {children}
      </div>
    );
  }

  return (
    <Link href={href}>
      <div className="py-2">
        <span className="mx-4 border-l border-blue" />
        {children}
      </div>
    </Link>
  );
}

function Sidebar() {
  return (
    <div className="w-64 p-4">
      <div className="pt-5 bg-white rounded-lg shadow-lg">
        <Header>Documentation</Header>
        <Item href="/docs">Overview</Item>
        <Item href="/docs/api">API Reference</Item>
        <Header>Getting Started</Header>
        <Item href="/docs/installation">Installation</Item>
        <Item href="/docs/configuration">Configuration Options</Item>
      </div>
    </div>
  );
}
export default Sidebar;
