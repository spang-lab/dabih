import React from 'react';
import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { Menu as MenuIcon, X as XIcon } from 'react-feather';
import { KeyStatus, UserButton, NavLink } from './util';

export default function Header(props) {
  const {
    links, user, signIn, signOut,
  } = props;

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-start flex-1 pl-12 sm:items-stretch sm:pl-0">
                <div className="flex items-center flex-shrink-0">
                  <Image
                    className="block w-auto h-10 rounded-full"
                    src="/images/dabih-logo.png"
                    width={40}
                    height={40}
                    alt="Dabih"
                  />
                  <span className="px-3 text-xl text-white">Dabih</span>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {links.map((item) => (
                      <NavLink key={item.label} href={item.href}>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <UserButton user={user} signIn={signIn} signOut={signOut} />
                <KeyStatus />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((item) => (
                <NavLink block key={item.label} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
