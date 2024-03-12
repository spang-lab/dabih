import base64url from './base64url';

const decrypt = async (
  key: CryptoKey,
  iv: ArrayBuffer,
  data: ArrayBuffer,
) => crypto.subtle.decrypt(
  {
    name: 'AES-CBC',
    iv,
  },
  key,
  data,
);

const toBase64 = async (key: CryptoKey) => {
  const buffer = await crypto.subtle.exportKey('raw', key);
  return base64url.fromUint8(buffer);
};

const fromUint8 = async (data: ArrayBuffer) => crypto.subtle.importKey(
  'raw',
  data,
  { name: 'AES-CBC ' },
  true,
  ['decrypt'],
);

export default {
  decrypt,
  toBase64,
  fromUint8,
};
