'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Link from 'next/link';

function Header({ children }) {
  return (
    <div className="p-2 text-lg font-extrabold text-gray-400">{children}</div>
  );
}
function Item({ children, href }) {
  const pathname = usePathname();

  if (pathname === href) {
    return (
      <div className="py-2 pr-2 font-semibold text-white bg-blue whitespace-nowrap">
        <span className="mx-4 py-1 border-l border-white" />
        {children}
      </div>
    );
  }

  return (
    <Link href={href}>
      <div className="py-2 pr-2 whitespace-nowrap">
        <span className="mx-4 py-1 border-l border-gray-300 " />
        {children}
      </div>
    </Link>
  );
}

function Sidebar() {
  return (
    <div className="bg-white">
      <div className="rounded-lg border pb-3">
        <Header>Documentation</Header>
        <Item href="/docs">Overview</Item>
        <Item href="/docs/installation">Installation</Item>
        <Item href="/docs/configuration">Configuration Options</Item>
        <Item href="/docs/crypto">Cryptography</Item>
        <Item href="/docs/privacy">Privacy Policy</Item>
        <Item href="/docs/contact">Contact</Item>
        <Header>Developers</Header>
        <Item href="/docs/api">API Reference</Item>
        <Item href="/docs/cli">Command Line Interface</Item>
        <Item href="/docs/paper">Paper</Item>
      </div>
    </div>
  );
}
export default Sidebar;
