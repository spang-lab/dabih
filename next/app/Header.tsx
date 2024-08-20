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
  User as UserIcon,
  LogOut,
  Settings,
} from 'react-feather';
import Image from 'next/image';
import { signOut, signIn } from 'next-auth/react';

import NavItem from './NavItem';
import { User } from 'next-auth';
import useKey from '@/lib/hooks/key';

function NavLine() {
  return <div className="flex-auto mx-3 h-6 border-t-2 border-gray-300" />;
}

const usePage = () => {
  const pathname = usePathname();
  const page = pathname?.split('/')[1] || 'start';
  return page;
};

export default function Header({ user }: { user?: User }) {
  const page = usePage();
  const key = useKey();
  const isActive = (key.status === 'active');

  const state = {
    start: 'complete',
    signin: (user) ? 'complete' : 'enabled',
    key: (user) ? (isActive) ? 'complete' : 'enabled' : 'disabled',
    upload: (isActive) ? 'enabled' : 'disabled',
    manage: (isActive) ? 'enabled' : 'disabled',
    profile: (user) ? 'enabled' : 'disabled',
  };
  state[page] = 'active';


  const getSignIn = () => {
    if (user) {
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
            <UserIcon size={24} />
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
