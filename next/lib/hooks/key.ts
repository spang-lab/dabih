import { useState, useEffect } from "react";
import storage from "../storage";
import api from "../api";
import crypto from "../crypto";

type KeyStatus =
  | "loading" // Waiting for API response
  | "unregistered" // user is not registered with the server
  | "no_key" // user is registered, but has no public key
  | "no_enabled_key" // user has no enabled keys
  | "unloaded" // server has a public key, but it's not loaded in the browser
  | "disabled" // server has a public key, but it's disabled
  | "active"; // server has a public key, and it's loaded in the browser

export interface KeyState {
  key: CryptoKey | null;
  hash: string | null;
  status: KeyStatus;
  sub: string | null;
}

export default function useKey() {
  const [key, setKey] = useState<KeyState>({
    key: null,
    hash: null,
    status: "loading",
    sub: null,
  });

  useEffect(() => {
    const listener = async () => {
      const storedKey = await storage.readKey();
      const { data: user, response } = await api.user.me();
      if (!user || response.status === 204) {
        if (storedKey) {
          storage.deleteKey();
          return;
        }
        setKey({
          key: null,
          hash: null,
          status: "unregistered",
          sub: null,
        });
        return;
      }
      const { keys, sub } = user;
      if (keys.length === 0) {
        if (storedKey) {
          storage.deleteKey();
          return;
        }
        setKey({
          key: null,
          hash: null,
          status: "no_key",
          sub,
        });
        return;
      }
      const validKeys = keys.filter((k) => k.enabled);
      if (validKeys.length === 0) {
        setKey({
          key: null,
          hash: null,
          status: "no_enabled_key",
          sub,
        });
        return;
      }

      if (!storedKey) {
        setKey({
          key: null,
          hash: null,
          status: "unloaded",
          sub,
        });
        return;
      }

      const hash = await crypto.privateKey.toHash(storedKey);
      const match = keys.find((k) => k.hash === hash);
      if (!match) {
        storage.deleteKey();
        return;
      }
      if (match.enabled) {
        setKey({
          key: storedKey,
          hash,
          status: "active",
          sub,
        });
        return;
      }
      setKey({
        key: null,
        hash,
        status: "disabled",
        sub,
      });
    };
    listener().catch(console.error);
    const elistener = () => {
      void listener();
    };
    window.addEventListener(storage.EVENT_NAME, elistener);
    return () => {
      window.removeEventListener(storage.EVENT_NAME, elistener);
    };
  }, []);

  if (key.status === "active") {
    return {
      key: key.key!,
      hash: key.hash!,
      status: key.status,
      sub: key.sub!,
    };
  }
  return {
    hash: key.hash,
    status: key.status,
    sub: key.sub,
  };
}
