import { create } from "zustand";
import crypto from "../crypto";

export type KeyStatus =
  | "loading" // Waiting for API response
  | "unregistered" // user is not registered with the server
  | "no_key" // user is registered, but has no public key
  | "no_enabled_key" // user has no enabled keys
  | "unloaded" // server has a public key, but it's not loaded in the browser
  | "disabled" // server has a public key, but it's disabled
  | "active"; // server has a public key, and it's loaded in the browser

export interface State {
  data: CryptoKey | null; // The key loaded in the browser
  hash: string | null; // The hash of the key
  status: KeyStatus; // The status of the key
}
interface Actions {
  setKey: (key: CryptoKey) => Promise<void>;
  getKey: () => CryptoKey;
  getStatus: (status: KeyStatus) => void;
  update: () => Promise<void>;
}
const storageKey = "dabih_private_key";
const storage = window.localStorage;

async function readKey() {
  const base64 = storage.getItem(storageKey);
  if (!base64) {
    return null;
  }
  return crypto.privateKey.fromBase64(base64);
}

async function writeKey(key: CryptoKey) {
  const base64 = await crypto.privateKey.toBase64(key);
  storage.setItem(storageKey, base64);
}

async function deleteKey() {
  storage.removeItem(storageKey);
}

const useKey = create<State & Actions>((set, get) => ({
  data: null,
  hash: null,
  status: "loading",

  setKey: async (key: CryptoKey) => {
    await writeKey(key);
    await get().update();
  },

  getKey: () => {
    const { status, data } = get();
    if (status !== "active" || !data) {
      throw new Error(`Could not get a valid key, status: ${status}`);
    }
    return data;
  },

  getStatus: (status: KeyStatus) => {
    set({ status });
  },

  update: async () => {
    const key = await readKey();

    // Placeholder for update logic
    // This could involve fetching the key from an API or other source
    console.log("Update method called");
  },
}));
export default useKey;
