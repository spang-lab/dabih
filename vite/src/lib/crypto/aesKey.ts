import base64url from "./base64url";

const decrypt = async (key: CryptoKey, ivStr: string, data: ArrayBuffer) => {
  const iv = base64url.toUint8(ivStr);
  return crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    data,
  );
};

const toUint8 = async (key: CryptoKey) => crypto.subtle.exportKey("raw", key);

const toBase64 = async (key: CryptoKey) => {
  const buffer = await toUint8(key);
  return base64url.fromUint8(buffer);
};

const fromUint8 = async (data: ArrayBuffer) =>
  crypto.subtle.importKey("raw", data, { name: "AES-CBC" }, true, ["decrypt"]);

const toHash = async (key: CryptoKey) => {
  const buffer = await toUint8(key);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return base64url.fromUint8(hash);
};

const aesKey = {
  decrypt,
  toBase64,
  fromUint8,
  toHash,
};
export default aesKey;
