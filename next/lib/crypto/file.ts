import privateKey from "./privateKey";
import publicKey from "./publicKey";
import aesKey from "./aesKey";

interface Key {
  hash: string;
  key: string;
}

interface FileData {
  keyHash: string;
}

interface File {
  data: FileData;
  keys: Key[];
}

const decryptKey = async (privKey: CryptoKey, file: File) => {
  const { keys, data } = file;
  const pubKey = await privateKey.toPublicKey(privKey);
  const hash = await publicKey.toHash(pubKey);
  const encryptedKey = keys.find((k) => k.hash === hash);
  if (!encryptedKey) {
    throw new Error(
      `Failed to decrypt: Key with hash ${hash} not found in keys`,
    );
  }
  const aesBuffer = await privateKey.decryptAesKey(privKey, encryptedKey.key);
  const key = await aesKey.fromUint8(aesBuffer);
  const keyHash = await aesKey.toHash(key);
  if (keyHash !== data.keyHash) {
    throw new Error(
      `Failed to decrypt: Hash mismatch: ${keyHash} !== ${encryptedKey.hash}`,
    );
  }
  return key;
};

const file = {
  decryptKey,
};
export default file;
