import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  UserPlus, Key, UploadCloud, Share2,
} from 'react-feather';
import { useSession } from 'next-auth/react';
import { storage } from '../../lib';

import NavItem from './NavItem';
import NavLine from './NavLine';

export default function Navigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [items, setItems] = useState({});
  const key = storage.useKey();

  const checkState = useCallback(async () => {
    if (session === undefined || key === undefined) {
      return;
    }
    const user = session ? session.user : null;

    const getKeyState = () => {
      if (key) return 'complete';
      if (user) return 'enabled';
      return 'disabled';
    };

    const state = {
      start: 'complete',
      account: user ? 'complete' : 'enabled',
      key: getKeyState(),
      upload: user && key ? 'enabled' : 'disabled',
      manage: user && key ? 'enabled' : 'disabled',
      admin:
        user && user.scopes && user.scopes.includes('admin')
          ? 'enabled'
          : 'disabled',
    };
    const path = router.asPath.split('/')[1] || 'start';

    const current = state[path];
    if (current === 'disabled') {
      router.push('/');
    }
    if (current === 'complete') {
      if (path === 'account') {
        router.push('/key');
      }
      if (path === 'key') {
        router.push('/manage');
      }
    }

    state[path] = 'active';
    setItems(state);
  }, [router, key, session]);
  useEffect(() => {
    checkState();
  }, [checkState]);

  const getAdmin = () => {
    if (!items.admin || items.admin === 'disabled') {
      return null;
    }
    return (
      <>
        <NavLine state={items.manage} />
        <NavItem href="/admin" state={items.admin} label="Admin">
          <Share2 size={24} />
        </NavItem>
      </>
    );
  };

  return (
    <div className="flex items-center">
      <NavItem href="/" state={items.start} label="Start">
        <UserPlus size={24} />
      </NavItem>
      <NavLine state={items.account} />
      <NavItem href="/account" state={items.account} label="Account">
        <UserPlus size={24} />
      </NavItem>
      <NavLine state={items.key} />
      <NavItem href="/key" state={items.key} label="Key">
        <Key size={24} />
      </NavItem>
      <NavLine state={items.upload} />
      <NavItem href="/upload" state={items.upload} label="Upload">
        <UploadCloud size={24} />
      </NavItem>
      <NavLine state={items.manage} />
      <NavItem href="/manage" state={items.manage} label="Manage">
        <Share2 size={24} />
      </NavItem>
      {getAdmin()}
    </div>
  );
}
