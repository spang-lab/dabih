'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import {
  UserPlus,
  Key,
  UploadCloud,
  Share2,
  Home,
  User,
  LogOut,
  Settings,
} from 'react-feather';
import Image from 'next/image';
import { signOut, signIn } from 'next-auth/react';

import useSession from '@/app/session';
import NavItem from './NavItem';

function NavLine() {
  return <div className="flex-auto mx-3 h-6 border-t-2 border-gray-300" />;
}

const usePage = () => {
  const pathname = usePathname();
  const page = pathname?.split('/')[1] || 'start';
  return page;
};

export default function Header() {
  const {
    status,
    keyStatus,
  } = useSession();

  const page = usePage();

  const getState = () => {
    const getKeyState = () => {
      switch (keyStatus) {
        case 'unauthenticated':
        case 'loading':
          return 'disabled';
        case 'unregistered':
        case 'unloaded':
        case 'disabled':
          return 'enabled';
        case 'active':
          return 'complete';
        default:
          throw new Error(`Unexpected key status ${keyStatus}`);
      }
    };
    const state = {
      start: 'complete',
      signin: (status === 'authenticated') ? 'complete' : 'enabled',
      key: getKeyState(),
      upload: (keyStatus === 'active') ? 'enabled' : 'disabled',
      manage: (keyStatus === 'active') ? 'enabled' : 'disabled',
      profile: (status === 'authenticated') ? 'enabled' : 'disabled',
    };
    state[page] = 'active';
    return state;
  };

  const state = getState();

  const getSignIn = () => {
    if (status === 'authenticated') {
      return (
        <>
          <NavLine />
          <button onClick={() => signOut()} type="button">
            <NavItem href="" state="enabled" label="Sign Out">
              <LogOut size={24} />
            </NavItem>
          </button>
        </>
      );
    }
    return (
      <>
        <NavLine />
        <button onClick={() => signIn()} type="button">
          <NavItem href="" state="enabled" label="Sign In">
            <User size={24} />
          </NavItem>
        </button>
      </>
    );
  };

  return (
    <nav className="bg-blue">
      <div className="max-w-7xl mx-auto flex items-center py-2 px-16">
        <Link href="/">
          <div className="relative flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 py-3 rounded-full">
              <Image
                className="block w-auto h-10 rounded-full"
                src="/images/dabih-logo.png"
                width={40}
                height={40}
                alt="Dabih"
              />
            </div>
            <div className="pt-2 text-xs text-white font-semibold text-center uppercase">
              Dabih
            </div>
          </div>
        </Link>
        <NavLine />
        <NavItem href="/" state={state.start} label="Home">
          <Home size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/signin" state={state.signin} label="Account">
          <UserPlus size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/key" state={state.key} label="Key">
          <Key size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/upload" state={state.upload} label="Upload">
          <UploadCloud size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/manage" state={state.manage} label="Manage">
          <Share2 size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/profile" state={state.profile} label="Settings">
          <Settings size={24} />
        </NavItem>
        {getSignIn()}
      </div>
    </nav>
  );
}
