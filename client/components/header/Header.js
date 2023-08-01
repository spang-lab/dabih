import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  UserPlus,
  Key,
  UploadCloud,
  Share2,
  Home,
  User,
  LogOut,
  Settings,
} from "react-feather";
import Image from "next/image";
import { signOut, useSession, signIn } from "next-auth/react";
import { storage } from "../../lib";
import { Link } from "../util";

import NavItem from "./NavItem";
import NavLine from "./NavLine";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session ? session.user : null;
  const [items, setItems] = useState({});
  const key = storage.useKey();

  const checkState = useCallback(async () => {
    if (session === undefined || key === undefined) {
      return;
    }

    const getKeyState = () => {
      if (key && user) return "complete";
      if (user) return "enabled";
      return "disabled";
    };

    const state = {
      start: "complete",
      account: user ? "complete" : "enabled",
      key: getKeyState(),
      upload: user && key ? "enabled" : "disabled",
      manage: user && key ? "enabled" : "disabled",
      profile: user ? "enabled" : "disabled",
    };
    const path = router.asPath.split("/")[1] || "start";

    const current = state[path];
    if (current === "disabled") {
      router.push("/");
    }
    if (current === "complete") {
      if (path === "account") {
        router.push("/key");
      }
      if (path === "key") {
        router.push("/manage");
      }
    }

    state[path] = "active";
    setItems(state);
  }, [router, key, session, user]);
  useEffect(() => {
    checkState();
  }, [checkState]);

  const getSignIn = () => {
    if (user) {
      return (
        <>
          <NavLine state={items.profile} />
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
        <NavLine state={items.profile} />
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
        <NavItem href="/" state={items.start} label="Home">
          <Home size={24} />
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
        <NavLine state={items.profile} />
        <NavItem href="/profile" state={items.profile} label="Settings">
          <Settings size={24} />
        </NavItem>
        {getSignIn()}
      </div>
    </nav>
  );
}
