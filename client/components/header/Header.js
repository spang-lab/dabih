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
import { useUser, useKey } from '@/lib/hooks';

import NavItem from './NavItem';
import NavLine from './NavLine';

const usePage = () => {
  const pathname = usePathname();
  const page = pathname?.split('/')[1] || 'start';
  return page;
};

export default function Header() {
  const user = useUser();
  const key = useKey();
  const page = usePage();

  const getState = () => {
    const isAuthenticated = user.status === 'authenticated';

    const getKeyState = () => {
      if (key && isAuthenticated) return 'complete';
      if (isAuthenticated) return 'enabled';
      return 'disabled';
    };

    const state = {
      start: 'complete',
      signin: isAuthenticated ? 'complete' : 'enabled',
      key: getKeyState(),
      upload: isAuthenticated && key ? 'enabled' : 'disabled',
      manage: isAuthenticated && key ? 'enabled' : 'disabled',
      profile: isAuthenticated ? 'enabled' : 'disabled',
    };
    state[page] = 'active';
    return state;
  };

  const state = getState();

  const getSignIn = () => {
    if (user.status === 'authenticated') {
      return (
        <>
          <NavLine state={state.profile} />
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
        <NavLine state={state.profile} />
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
        <NavLine state={state.signin} />
        <NavItem href="/signin" state={state.signin} label="Account">
          <UserPlus size={24} />
        </NavItem>
        <NavLine state={state.key} />
        <NavItem href="/key" state={state.key} label="Key">
          <Key size={24} />
        </NavItem>
        <NavLine state={state.upload} />
        <NavItem href="/upload" state={state.upload} label="Upload">
          <UploadCloud size={24} />
        </NavItem>
        <NavLine state={state.manage} />
        <NavItem href="/manage" state={state.manage} label="Manage">
          <Share2 size={24} />
        </NavItem>
        <NavLine state={state.profile} />
        <NavItem href="/profile" state={state.profile} label="Settings">
          <Settings size={24} />
        </NavItem>
        {getSignIn()}
      </div>
    </nav>
  );
}
